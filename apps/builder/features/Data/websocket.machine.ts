import { safeFetch } from "@open-decision/api-helpers";
import { ODProgrammerError } from "@open-decision/type-classes";
import { assign, createMachine, Interpreter } from "xstate";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { z } from "zod";

type Context = {
  id?: string;
  yDoc?: Doc;
  retryLimit: number;
  retries: number;
  onSync?: (_value: unknown) => void;
  token?: string;
};

type WebsocketCallbackEvents =
  | { type: "connection.ready" }
  | { type: "connection.error" };

type Events =
  | { type: "OPEN"; id: string; yDoc: Doc; onSync: (_value: unknown) => void }
  | { type: "CLOSE" }
  | { type: "RECONNECT" }
  | { type: "RETRY" }
  | WebsocketCallbackEvents;

export type WebsocketService = Interpreter<Context, any, Events, any, any>;

export const websocketMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import("./websocket.machine.typegen").Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as {
        openWebsocket: {
          data: { websocket: InstanceType<typeof WebsocketProvider> };
        };
        authenticate: {
          data: { token: string };
        };
      },
    },
    id: "websocketMachine",
    initial: "unconnected",
    context: {
      id: undefined,
      yDoc: undefined,
      retryLimit: 10,
      retries: 0,
      onSync: undefined,
    },
    states: {
      unconnected: {
        on: {
          OPEN: { target: "authenticating", actions: "assignDataToContext" },
        },
      },
      retry: {
        after: {
          retry_delay: {
            target: "authenticating",
            actions: "incrementRetries",
          },
        },
      },
      authenticating: {
        invoke: {
          id: "authenticate",
          src: "authenticate",
          onDone: { target: "connected", actions: "assignTokenToContext" },
          onError: { target: "error" },
        },
      },
      connected: {
        invoke: {
          id: "openWebsocketConnection",
          src: "openWebsocket",
        },
        on: {
          "connection.error": [
            {
              target: "retry",
              cond: "underRetryLimit",
              internal: false,
            },
            { target: "error" },
          ],
        },
      },
      error: {
        type: "final",
      },
    },
  },
  {
    services: {
      authenticate: async (_context, _event) => {
        const {
          data: { token },
        } = await safeFetch(
          "/api/external-api/auth/getToken",
          {},
          { validation: z.object({ token: z.string() }), retry: 3 }
        );

        return { token };
      },
      openWebsocket: (context) => (callback) => {
        if (!process.env["NEXT_PUBLIC_OD_WEBSOCKET_ENDPOINT"])
          throw new ODProgrammerError({
            code: "MISSING_ENV_VARIABLE",
            message:
              "To run the builder the NEXT_PUBLIC_OD_WEBSOCKET_ENDPOINT needs to be set to a valid websocket endpoint.",
          });

        if (!context.id || !context.yDoc || !context.token)
          return callback("connection.error");

        const websocket = new WebsocketProvider(
          `${process.env["NEXT_PUBLIC_OD_WEBSOCKET_ENDPOINT"]}/v1/builder-sync`,
          context.id,
          context.yDoc,
          { params: { auth: context.token } }
        );

        websocket.on("sync", () => {
          context.onSync?.(true);
          callback("connection.ready");
        });

        setTimeout(() => {
          if (!websocket.synced) return callback("connection.error");
        }, 5000);

        websocket.on("connection-error", () => {
          return callback("connection.error");
        });

        return () => websocket.destroy();
      },
    },
    actions: {
      assignDataToContext: assign((context, event) => ({
        ...context,
        id: event.id,
        onSync: event.onSync,
        yDoc: event.yDoc,
      })),
      assignTokenToContext: assign({
        token: (_context, event) => event.data.token,
      }),
      incrementRetries: assign({ retries: (context) => context.retries + 1 }),
    },
    guards: {
      underRetryLimit: (context, _event) =>
        context.retries < context.retryLimit,
    },
    delays: {
      retry_delay: (context, _event) => Math.min(context.retries * 1000, 20000),
    },
  }
);
