import * as React from "react";
import { createTreeStore } from "./treeStore";
import { IndexeddbPersistence } from "y-indexeddb";
import { createTreeClient, ODError } from "@open-decision/type-classes";
import { useTreeSuspension } from "./hooks/useTreeSuspension";
import { websocketMachine } from "../websocket.machine";
import { useMachine } from "@xstate/react";

export type TTreeContext = ReturnType<typeof createTreeStore>;

const TreeContext = React.createContext<TTreeContext | null>(null);

type Props = { children: React.ReactNode; id: string };
const TreeProvider = ({ id, children }: Props) => {
  const treeStore = React.useMemo(
    () => (id ? createTreeStore(id) : undefined),
    [id]
  );

  const [state, send] = useMachine(websocketMachine, { devTools: true });

  if (state.matches("error")) {
    throw new ODError({
      code: "WEBSOCKET_CONNECTION_FAILED",
      message: "Es konnte keine Websocket Verbindung hergestellt werden.",
    });
  }

  React.useEffect(() => {
    if (id && treeStore) {
      new IndexeddbPersistence(id, treeStore.yDoc);
      send({
        type: "OPEN",
        id,
        yDoc: treeStore.yDoc,
        onSync: treeStore.onSync,
      });

      return () => {
        send({ type: "CLOSE" });
      };
    }

    return () => undefined;
  }, [id, send, treeStore]);

  return id && treeStore ? (
    <TreeContext.Provider value={treeStore}>{children}</TreeContext.Provider>
  ) : null;
};

export default TreeProvider;

export const useTreeContext = () => {
  const context = React.useContext(TreeContext);

  if (!context)
    throw new Error(
      `useTreeContext can only be used when nested inside of a TreeProvider`
    );

  useTreeSuspension(context?.tree as TTreeContext["tree"]);

  return context;
};

export const useTreeClient = () => {
  const context = useTreeContext();
  const treeClient = createTreeClient(context.tree.tree);

  return treeClient;
};
