import * as React from "react";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { Subscribable } from "xstate";
import {
  InterpretedTreeState,
  SendFn,
  treeMachine,
  TreeService,
} from "./treeMachine";

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

type usePartOfTree = <
  T,
  TEmitted = TreeService extends Subscribable<infer Emitted> ? Emitted : never
>(
  selector: (emitted: TEmitted) => T,
  compare?: (a: T, b: T) => boolean,
  getSnapshot?: (a: TreeService) => TEmitted
) => [T, SendFn];
export const usePartOfTree: usePartOfTree = (
  selectorFn,
  compare,
  getSnapshot
) => {
  const service = useTreeService();
  const data = useSelector(service, selectorFn, compare, getSnapshot);

  return [data, service.send];
};

export const useTree = (): [InterpretedTreeState, SendFn] => {
  const service = useTreeService();

  return useActor(service);
};
