import { useAuth } from "features/Auth/useAuth";
import * as React from "react";
import { createTreeStore } from "./treeStore";
import { useEffectOnce } from "react-use";
import { IndexeddbPersistence } from "y-indexeddb";
import { useTreeId } from "../../../Data/useTreeId";

const TreeContext = React.createContext<null | ReturnType<
  typeof createTreeStore
>>(null);

type Props = { children: React.ReactNode };
export const TreeProvider = ({ children }: Props) => {
  const id = useTreeId();
  const [, send] = useAuth();
  const treeStore = React.useMemo(() => createTreeStore(id), [id]);

  useEffectOnce(() => {
    new IndexeddbPersistence(id, treeStore.yDoc);
    send({
      type: "OPEN_WEBSOCKET",
      id,
      yDoc: treeStore.yDoc,
      onSync: treeStore.onSync,
    });

    return () => {
      send("CLOSE_WEBSOCKET");
    };
  });

  return (
    <TreeContext.Provider value={treeStore}>{children}</TreeContext.Provider>
  );
};

export const useTreeContext = () => {
  const context = React.useContext(TreeContext);

  if (!context)
    throw new Error(
      `useTreeContext can only be used when nested inside of a TreeProvider`
    );

  return context;
};
