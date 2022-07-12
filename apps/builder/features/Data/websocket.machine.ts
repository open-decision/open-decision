import { ODProgrammerError } from "@open-decision/type-classes";
import { assign, createMachine, Interpreter } from "xstate";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";

type Context = {
  id?: string;
  yDoc?: Doc;
  retryLimit: number;
  retries: number;
  onSync?: (_value: unknown) => void;
};

type Events =
  | { type: "OPEN"; id: string; yDoc: Doc; onSync: (_value: unknown) => void }
  | { type: "CLOSE" }
  | { type: "RECONNECT" }
  | { type: "RETRY" };

export type WebsocketService = Interpreter<Context, any, Events, any, any>;

export const websocketMachine = createMachine(
  {
    tsTypes: {} as import("./websocket.machine.typegen").Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: "websocketMachine",
    initial: "unconnected",
    context: {
      id: undefined,
      yDoc: undefined,
      retryLimit: 3,
      retries: 0,
      onSync: undefined,
    },
    on: {
      CLOSE: "closed",
    },
    states: {
      unconnected: {
        on: {
          OPEN: { target: "connected", actions: "assignDataToContext" },
        },
      },
      connected: {
        invoke: {
          id: "openWebsocketConnection",
          src: "openWebsocket",
        },
        on: {
          RETRY: [
            {
              target: "connected",
              cond: "underRetryLimit",
              actions: "incrementRetries",
              internal: false,
            },
            { target: "error" },
          ],
        },
      },
      closed: {},
      error: { type: "final" },
    },
  },
  {
    services: {
      openWebsocket: (context) => (callback) => {
        if (!context.id || !context.yDoc) return;

        if (!process.env.NEXT_PUBLIC_OD_WEBSOCKET_ENDPOINT)
          throw new ODProgrammerError({
            code: "MISSING_ENV_VARIABLE",
            message:
              "To run the builder the NEXT_PUBLIC_OD_WEBSOCKET_ENDPOINT needs to be set to a valid websocket endpoint.",
          });

        const websocket = new WebsocketProvider(
          `${process.env.NEXT_PUBLIC_OD_WEBSOCKET_ENDPOINT}/v1/builder-sync`,
          context.id,
          context.yDoc,
          { connect: true }
        );

        websocket.on("sync", () => context.onSync?.(true));

        setTimeout(() => {
          if (!websocket.synced) callback("RETRY");
        }, 5000);

        websocket.on("connection-error", () => {
          return callback("CLOSE");
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
      incrementRetries: assign((context) => ({ retries: context.retries++ })),
    },
    guards: {
      underRetryLimit: (context, _event) =>
        context.retries > context.retryLimit,
    },
  }
);
