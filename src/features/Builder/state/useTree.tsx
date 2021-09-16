import { useInterpret } from "@xstate/react";
import * as React from "react";
import { assign } from "xstate";
import { Tree } from "../types/Tree";
import { treeMachine, TreeService } from "./treeMachine";

export const TreeContext = React.createContext<TreeService | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof TreeContext.Provider>,
  "value"
>;
export function TreeProvider({ children }: TreeProviderProps) {
  const service = useInterpret(treeMachine, {
    actions: { createNewTree: assign(Tree.createTree) },
  });

  return (
    <TreeContext.Provider value={service}>{children}</TreeContext.Provider>
  );
}

export function useTree() {
  const treeService = React.useContext(TreeContext);

  if (!treeService) {
    throw new Error("useTree can only be used inside of a TreeProvider");
  }

  return treeService;
}
