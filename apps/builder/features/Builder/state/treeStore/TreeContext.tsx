import * as React from "react";
import { createTreeStore } from "./treeStore";
import { IndexeddbPersistence } from "y-indexeddb";
import { useTreeId } from "../../../Data/useTreeId";
import { ODError } from "@open-decision/type-classes";
import { useTreeSuspension } from "./hooks/useTreeSuspension";
import { websocketMachine } from "../../../Data/websocket.machine";
import { useMachine } from "@xstate/react";

export type TTreeContext = ReturnType<typeof createTreeStore>;

const TreeContext = React.createContext<TTreeContext | null>(null);

type Props = { children: React.ReactNode };
export const TreeProvider = ({ children }: Props) => {
  const id = useTreeId();
  const treeStore = React.useMemo(() => createTreeStore(id), [id]);
  const [state, send] = useMachine(websocketMachine, { devTools: true });

  if (state.matches("error"))
    throw new ODError({
      code: "BUILDER_WEBSOCKET_CONNECTION_FAILED",
      message: "Es konnte keine Websocket Verbindung hergestellt werden.",
    });

  React.useEffect(() => {
    new IndexeddbPersistence(id, treeStore.yDoc);
    send({
      type: "OPEN",
      id,
      yDoc: treeStore.yDoc,
      onSync: treeStore.onSync,
    });
  }, [id, send, treeStore.onSync, treeStore.yDoc]);

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
