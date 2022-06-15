import { useAuth } from "../../../../features/Auth/useAuth";
import * as React from "react";
import { createTreeStore } from "./treeStore";
import { useEffectOnce } from "react-use";
import { IndexeddbPersistence } from "y-indexeddb";
import { useTreeId } from "../../../Data/useTreeId";
import { ODError } from "@open-decision/type-classes";
import { useTreeSuspension } from "./hooks/useTreeSuspension";

export type TTreeContext = ReturnType<typeof createTreeStore>;

const TreeContext = React.createContext<TTreeContext | null>(null);

type Props = { children: React.ReactNode };
export const TreeProvider = ({ children }: Props) => {
  const id = useTreeId();
  const [state, send] = useAuth();
  const treeStore = React.useMemo(() => createTreeStore(id), [id]);

  if (
    state.matches({
      loggedIn: {
        websocket: "connect_failed",
      },
    })
  )
    throw new ODError({
      code: "BUILDER_WEBSOCKET_CONNECTION_FAILED",
      message: "Es konnte keine Websocket Verbindung hergestellt werden.",
    });

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
  useTreeSuspension(context?.tree as TTreeContext["tree"]);

  if (!context)
    throw new Error(
      `useTreeContext can only be used when nested inside of a TreeProvider`
    );

  return context;
};
