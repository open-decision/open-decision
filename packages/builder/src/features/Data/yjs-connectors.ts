import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";

const isBrowser = typeof window !== "undefined";

export const connectWebsocket = (doc: Y.Doc, id: string, token: string) => {
  const wsProvider = isBrowser
    ? new WebsocketProvider(
        process.env.OD_WEBSOCKET_ENDPOINT ??
          "wss://od-mono-api.onrender.com/v1/builder-sync",
        id,
        doc,
        { params: { auth: token } }
      )
    : null;

  wsProvider?.on("status", (event) => {
    console.log(event.status); // logs "connected" or "disconnected"
  });

  return wsProvider;
};

export const connectLocalStorage = (doc: Y.Doc, id: string) => {
  const persistence = new IndexeddbPersistence(id, doc);

  persistence.on("synced", (event) => console.log(event.status));
};
