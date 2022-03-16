// import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Doc } from "yjs";

const isBrowser = typeof window !== "undefined";

// export const connectWebsocket = (doc: Doc, id: string, token: string) => {
//   const wsProvider = isBrowser
//     ? new WebsocketProvider(
//         process.env.OD_WEBSOCKET_ENDPOINT ??
//           "wss://od-mono-api.onrender.com/v1/builder-sync",
//         id,
//         doc,
//         { params: { auth: token } }
//       )
//     : null;

//   wsProvider?.on("status", (event) => {
//     console.log(event.status); // logs "connected" or "disconnected"
//   });

//   return wsProvider;
// };
