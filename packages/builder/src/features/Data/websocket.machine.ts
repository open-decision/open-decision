import { ODProgrammerError } from "@open-decision/type-classes";
import { createMachine } from "xstate";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";

type Context = {
  id?: string;
  yDoc?: Doc;
  token?: string;
  onSync?: () => void;
};

type Events =
  | { type: "CREATED" }
  | { type: "CLOSE" }
  | { type: "INITIALIZE"; id: string; yDoc: Doc; token: string }
  | { type: "RECONNECT" };

export const websocketMachine = createMachine<Context, Events>({
  id: "websocketMachine",
  initial: "connect",
  context: { id: undefined, yDoc: undefined, token: undefined },
  on: { CLOSE: "close" },
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
            process.env.NEXT_PUBLIC_OD_WEBSOCKET_ENDPOINT,
            context.id,
            context.yDoc,
            { params: { auth: context.token } }
          );

          websocket.on("sync", () => context.onSync?.());

          websocket.on("connection-error", () => callback("CLOSE"));

          return () => websocket.destroy();
        },
      },
    },
    close: { type: "final" },
  },
});
