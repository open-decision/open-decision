import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { treeMachine } from "./createTreeMachine";
import * as localForage from "localforage";
import { Tree, TTree } from "../types";
import { Errors } from "io-ts";
import { useQuery } from "react-query";
import { useActor, useInterpret } from "@xstate/react";

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

// const validateTreeId = pipe(
//   fromPredicate(
//     (id): id is string => isString(id),
//     () => "The provided id is not of the valid type"
//   )
// );

// function onInvalidId(error: string) {
//   console.warn(error);
//   // TODO Make it so that when there is no id a new tree is created.
//   return "1234";
// }

// function onValidId(id: string) {
//   return id;
// }

export function useTree() {
  // const router = useRouter();
  // const treeId = router.query.id;

  // const validTreeId = pipe(
  //   validateTreeId(treeId),
  //   fold(onInvalidId, onValidId)
  // );

  const service = useInterpret(treeMachine);
  const actor = useActor(service);

  useQuery("tree", () => getTreeFromStorage("tree"), {
    retry: 0,
    onSuccess: (result) => {
      actor[1]({ type: "resolve", tree: result });
    },
    onError: (_error) => {
      actor[1]({ type: "reject" });
    },
  });

  return actor;
}
