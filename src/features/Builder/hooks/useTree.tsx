import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { treeMachine } from "./createTreeMachine";
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

export function useTree() {
  const service = useInterpret(treeMachine);

  useQuery("tree", () => getTreeFromStorage("tree"), {
    retry: 0,
    onSuccess: (result) => {
      service.send({ type: "resolve", tree: result });
    },
    onError: (_error) => {
      service.send({ type: "reject" });
    },
  });

  return service;
}
