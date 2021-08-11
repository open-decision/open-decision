import * as React from "react";
import { useActor, useInterpret } from "@xstate/react";
import { fold, fromPredicate } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { isString } from "fp-ts/lib/string";
import { useRouter } from "next/router";
import { createTreeMachine, InterpretedTreeMachine } from "./createTreeMachine";

const validateTreeId = pipe(
  fromPredicate(
    (id): id is string => isString(id),
    () => "The provided id is not of the valid type"
  )
);

function onInvalidId(error: string) {
  console.warn(error);
  // TODO Make it so that when there is no id a new tree is created.
  return "1234";
}

function onValidId(id: string) {
  return id;
}

const TreeMachineContext = React.createContext<InterpretedTreeMachine | null>(
  null
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useTree() {
  const context = React.useContext(TreeMachineContext);

  if (!context) {
    throw new Error(
      "The useTree Hook can only be used inside of a TreeProvider."
    );
  }

  return useActor(context);
}

type TreeProviderProps = { children: React.ReactNode };

export function TreeProvider({ children }: TreeProviderProps): JSX.Element {
  const router = useRouter();
  const treeId = router.query.id;

  const validTreeId = pipe(
    validateTreeId(treeId),
    fold(onInvalidId, onValidId)
  );

  const treeMachine = createTreeMachine({
    id: validTreeId,
    tree: {
      config: { nodeTypes: {}, portTypes: {} },
      state: { elements: [], treeName: "test" },
    },
  });

  const service = useInterpret(treeMachine);

  return (
    <TreeMachineContext.Provider value={service}>
      {children}
    </TreeMachineContext.Provider>
  );
}
