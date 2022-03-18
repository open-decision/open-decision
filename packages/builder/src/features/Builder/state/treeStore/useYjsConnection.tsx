import { useAuth } from "features/Auth/useAuth";
import * as React from "react";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { yDoc } from "./treeStore";

const isBrowser = typeof window !== "undefined";
export function useYjsConnection(id: string) {
  const [{ context }] = useAuth();

  React.useEffect(() => {
    const persistence = new IndexeddbPersistence(id, yDoc);

    const websocket =
      isBrowser && context.user?.access.token
        ? new WebsocketProvider(
            process.env.OD_WEBSOCKET_ENDPOINT ??
              "wss://od-mono-api.onrender.com/v1/builder-sync",
            id,
            yDoc,
            {
              params: { auth: context.user?.access.token },
            }
          )
        : null;

    return () => {
      yDoc?.destroy();
      websocket?.destroy();
      persistence.destroy();
    };
  }, [context.user?.access.token, id]);
}
