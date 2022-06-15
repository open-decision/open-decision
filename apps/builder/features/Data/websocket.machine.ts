import { ODProgrammerError } from "@open-decision/type-classes";
import { assign, createMachine, sendParent } from "xstate";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";

type Context = {
  id?: string;
  yDoc?: Doc;
  token?: string;
  retryLimit: number;
  retries: number;
  onSync?: () => void;
};

type Events =
  | { type: "CREATED" }
  | { type: "CLOSE" }
  | { type: "INITIALIZE"; id: string; yDoc: Doc; token: string }
  | { type: "RECONNECT" }
  | { type: "RETRY" };

export const websocketMachine = createMachine<Context, Events>(
  {
    id: "websocketMachine",
    initial: "connect",
    context: {
      id: undefined,
      yDoc: undefined,
      token: undefined,
      retryLimit: 3,
      retries: 0,
    },
    on: {
      CLOSE: "close",
    },
    states: {
      connect: {
        invoke: {
          id: "openWebsocketConnection",
          src: (context) => (callback, _onReceive) => {
            if (!context.token || !context.id || !context.yDoc) return;

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
              { params: { auth: context.token } }
            );

            websocket.on("sync", () => context.onSync?.());

            setTimeout(() => {
              if (!websocket.synced) callback("RETRY");
            }, 5000);

            websocket.on("connection-error", () => callback("CLOSE"));

            return () => websocket.destroy();
          },
        },
        on: {
          RETRY: [
            {
              target: "connect",
              cond: "underRetryLimit",
              actions: "incrementRetries",
              internal: false,
            },
            { target: "error" },
          ],
        },
      },
      close: { entry: sendParent("WEBSOCKET_CLOSED") },
      error: { entry: sendParent("WEBSOCKET_CONNECTION_FAILED") },
    },
  },
  {
    actions: {
      incrementRetries: assign((context) => ({ retries: context.retries++ })),
    },
    guards: {
      underRetryLimit: (context, _event) =>
        context.retries > context.retryLimit,
    },
  }
);
