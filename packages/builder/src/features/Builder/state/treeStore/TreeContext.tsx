import * as React from "react";
import { createTreeStore } from "./treeStore";

const TreeContext = React.createContext<null | ReturnType<
  typeof createTreeStore
>>(null);

type Props = { id: string; children: React.ReactNode };
export const TreeProvider = ({ id, children }: Props) => {
  const treeStore = React.useMemo(() => createTreeStore(id), [id]);

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
