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

          const websocket = new WebsocketProvider(
            process.env.OD_WEBSOCKET_ENDPOINT ??
              "ws://localhost:4000/v1/builder-sync",
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
