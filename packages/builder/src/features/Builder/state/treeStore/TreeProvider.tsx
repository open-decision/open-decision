import * as Y from "yjs";
import { useAuth } from "features/Auth/useAuth";
import * as React from "react";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { createTreeStore } from "./treeStore";

const isBrowser = typeof window !== "undefined";

type ProviderProps = { children: React.ReactNode; id: string };

const Context = React.createContext<ReturnType<typeof createTreeStore> | null>(
  null
);

export const TreeProvider = ({ children, id }: ProviderProps) => {
  const [{ context }] = useAuth();
  const yDoc = React.useMemo(() => {
    console.log(`%ccreated new Doc`, "color:green");
    return new Y.Doc();
  }, []);

  const treeStore = React.useMemo(() => {
    if (yDoc) {
      const yMap = yDoc.getMap(id);
      return createTreeStore(id, yMap);
    }
  }, [id, yDoc]);

  React.useEffect(() => {
    const persistence = new IndexeddbPersistence(id, yDoc);
    persistence.on("synced", () =>
      console.log("%csynced Index DB", "color:green")
    );

    const websocket =
      isBrowser && context.user?.access.token
        ? new WebsocketProvider("ws://localhost:1234", id, yDoc, {
            params: { auth: context.user?.access.token },
          })
        : null;

    websocket?.on("sync", () =>
      console.log("%cWebsocket synced", "color:green")
    );

    yDoc.on("update", (...params) => console.log(`Doc ${id} update`, params));
    yDoc.on("destroy", () => console.log(`%cDoc ${id} destroyed`, "color:red"));

    return () => {
      yDoc?.destroy();
      websocket?.destroy();
      persistence.destroy();
    };
  }, [id, treeStore, context.user?.access.token, yDoc]);

  if (!yDoc || !treeStore) return null;

  return <Context.Provider value={treeStore}>{children}</Context.Provider>;
};

export const useTree = () => {
  const treeStore = React.useContext(Context);

  if (!treeStore) {
    throw new Error(
      `A TreeProvider needs to be wrapped around the usage location of useTree`
    );
  }

  return treeStore;
};
