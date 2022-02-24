import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";

const isBrowser = typeof window !== "undefined";

export const connectWebsocket = (doc: Y.Doc, id: string) => {
  const wsProvider = isBrowser
    ? new WebsocketProvider("ws://localhost:5000", id, doc)
    : null;

  wsProvider?.on("status", (event) => {
    console.log(event.status); // logs "connected" or "disconnected"
  });
};

export const connectLocalStorage = (doc: Y.Doc, id: string) => {
  const persistence = new IndexeddbPersistence(id, doc);

  persistence.on("synced", (event) => console.log(event.status));
};
