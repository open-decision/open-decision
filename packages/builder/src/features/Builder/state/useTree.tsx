import * as React from "react";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { TreeInterpreter, createTreeMachine } from "./treeMachine";
import { BuilderTree } from "@open-decision/type-classes";
import {
  useGetFullTreeQuery,
  useUpdateTreeMutation,
} from "features/Data/generated/graphql";
import { createInterpreterContext } from "utils/createStateMachineContext";
import { BaseHeader } from "components";
import { Stack } from "@open-legal-tech/design-system";
import { LoadingSpinner } from "components/LoadingSpinner";
import localforage from "localforage";
import { useQuery } from "react-query";

async function getTreeFromStorage(id: string) {
  const possibleTree = await localforage.getItem(id);
  if (!possibleTree) return undefined;
  const parsedTree = BuilderTree.Type.safeParse(possibleTree);

  if (parsedTree.success) return parsedTree.data;

  return parsedTree.error;
}

type TreeProps = { children: React.ReactNode; tree: BuilderTree.TTree };
export const [Provider, useTreeService] =
  createInterpreterContext<TreeInterpreter>("TreeContext");

function Tree({ children, tree }: TreeProps) {
  const { mutate: updateTree } = useUpdateTreeMutation();

  const treeMachine = React.useCallback(
    () =>
      createTreeMachine(async function syncFn(context) {
        updateTree({
          id: tree.id,
          data: { name: { set: context.name }, treeData: context.treeData },
        });
      }),
    [tree.id, updateTree]
  );

  const service = useInterpret(treeMachine, { context: tree });

  return <Provider value={service}>{children}</Provider>;
}

type TreeProviderProps = Omit<
  React.ComponentProps<typeof Provider>,
  "value"
> & { id: string };

export function TreeProvider({ children, id }: TreeProviderProps) {
  const { data: localTree, isLoading: isLoadingLocalTree } = useQuery(
    "LocalTree",
    async () => await getTreeFromStorage(id)
  );

  const { data: tree, isLoading } = useGetFullTreeQuery(
    { id: Number(id) },
    {
      select: (data) => {
        const parsedTree = BuilderTree.Type.safeParse({
          ...data.decisionTree,
          treeData: data.decisionTree?.treeData ?? {},
        });
        if (parsedTree.success) return parsedTree.data;

        throw new Error(parsedTree.error.message);
      },
      enabled: Boolean(id),
    }
  );

  return !isLoading && tree != null ? (
    <Tree tree={tree}>{children}</Tree>
  ) : (
    <>
      <BaseHeader css={{ gridColumn: "1 / -1", gridRow: "1" }} />
      <Stack
        css={{
          gridColumn: "1 / -1",
          gridRow: "2",
        }}
        center
      >
        <LoadingSpinner />
      </Stack>
    </>
  );
}

export function useTree(): [TreeInterpreter["state"], TreeInterpreter["send"]];
export function useTree<T>(
  selectorFn?: (context: TreeInterpreter["state"]["context"]) => T
): [T, TreeInterpreter["send"]];
export function useTree<T>(
  selectorFn?: (context: TreeInterpreter["state"]["context"]) => T
): [TreeInterpreter["state"] | T, TreeInterpreter["send"]] {
  const service = useTreeService();

  const data = useSelector(service, (state) =>
    selectorFn ? selectorFn?.(state.context) : state
  );

  React.useDebugValue("Tree");

  return [data, service.send];
}

export function useSyncMachine() {
  const [syncMachineRef] = useTree((state) => state.syncMachineRef);

  return useActor(syncMachineRef);
}
