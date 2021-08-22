import * as React from "react";
import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { treeMachine, TreeService } from "./createTreeMachine";
import * as localForage from "localforage";
import { Tree, TTree } from "../types";
import { Errors } from "io-ts";
import { useQuery } from "react-query";
import { useInterpret } from "@xstate/react";

async function getTreeFromStorage(id: string) {
  function onFailure(error: Errors) {
    return Promise.reject(error);
  }

  function onSuccess(value: TTree) {
    return Promise.resolve(value);
  }

  const possibleTree = await localForage.getItem(id);
  return pipe(possibleTree, Tree.decode, fold(onFailure, onSuccess));
}
export const TreeContext = React.createContext<TreeService | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof TreeContext.Provider>,
  "value"
>;
export function TreeProvider({ children }: TreeProviderProps) {
  const service = useInterpret(treeMachine);

  useQuery("tree", () => getTreeFromStorage("tree"), {
    retry: 0,
    onSuccess: (result) => {
      service.send({ type: "foundTree", tree: result });
    },
    onError: (_error) => {
      service.send({ type: "noTree" });
    },
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
