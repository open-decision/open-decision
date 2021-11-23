import * as React from "react";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { Subscribable } from "xstate";
import {
  InterpretedTreeState,
  SendFn,
  treeMachine,
  TreeService,
} from "./treeMachine";
import { BuilderTree } from "@open-decision/type-classes";

export const TreeContext = React.createContext<TreeService | null>(null);
type TreeProviderProps = Omit<
  React.ComponentProps<typeof TreeContext.Provider>,
  "value"
>;
export function TreeProvider({ children }: TreeProviderProps) {
  const service = useInterpret(treeMachine, { devTools: true });

  return (
    <TreeContext.Provider value={service}>{children}</TreeContext.Provider>
  );
}

export function useTreeService() {
  const treeService = React.useContext(TreeContext);

  if (!treeService) {
    throw new Error("useTree can only be used inside of a TreeProvider");
  }

  return treeService;
}

export function useTree(): [InterpretedTreeState, SendFn];
export function useTree<T>(
  selectorFn?: (tree: BuilderTree.TTree) => T
): [T, SendFn];
export function useTree<T>(
  selectorFn?: (tree: BuilderTree.TTree) => T
): [InterpretedTreeState | T, SendFn] {
  const service = useTreeService();
  const hasSelector = selectorFn != null;

  const data = useSelector(service, (state) =>
    hasSelector ? selectorFn(state.context) : state
  );

  return [data, service.send];
}
