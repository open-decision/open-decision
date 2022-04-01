import { useAuth } from "features/Auth/useAuth";
import * as React from "react";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { useTreeContext } from "./TreeContext";

const isBrowser = typeof window !== "undefined";
export function useYjsConnection(id: string) {
  const [{ context }] = useAuth();
  const { yDoc, nonSyncedStore, resolve } = useTreeContext();

  React.useEffect(() => {
    // const persistence = new IndexeddbPersistence(id, yDoc);

    const websocket =
      isBrowser && context.user?.access.token
        ? new WebsocketProvider(
            process.env.OD_WEBSOCKET_ENDPOINT ??
              "ws://localhost:4000/v1/builder-sync",
            id,
            yDoc,
            { params: { auth: context.user?.access.token } }
          )
        : null;

    websocket?.on("sync", () => resolve());

    return () => {
      websocket?.destroy();
      yDoc?.destroy();
      // persistence.destroy();
    };
  }, [context.user?.access.token, id, nonSyncedStore, resolve, yDoc]);
}
