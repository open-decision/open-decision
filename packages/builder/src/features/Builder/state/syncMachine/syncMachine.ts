import { createMachine, sendParent } from "xstate";
import { assign as immerAssign } from "@xstate/immer";
import { PatchTreeMutation } from "features/Data/generated/graphql";
import localforage from "localforage";
import { BuilderTree } from "@open-decision/type-classes";

type Events =
  | { type: "sync"; data: BuilderTree.TPatch[] }
  | { type: "patchesFound"; patches: BuilderTree.TPatch[] }
  | { type: "noPatchesFound" }
  | { type: "retry" };

async function updateTreePatchesInStorage(
  id: string,
  patches: BuilderTree.TPatch[]
) {
  localforage.setItem(id, patches);
}

export const createSyncMachine = (
  treeId: number,
  syncFn: (patches: BuilderTree.TPatch[]) => Promise<PatchTreeMutation>
) =>
  createMachine(
    {
      context: { patches: [], treeId },
      tsTypes: {} as import("./syncMachine.typegen").Typegen0,
      schema: {
        events: {} as Events,
        context: {} as {
          treeId: number;
          patches: BuilderTree.TPatch[];
          error?: string;
        },
        services: {} as {
          getTreePatchesFromStorage: { data: BuilderTree.TPatch[] };
        },
      },
      id: "sync",
      initial: "restore",
      on: {
        sync: {
          actions: [
            "syncPatchesToLocalStorage",
            "assignPatchesToContext",
            "sendPatchesReceived",
          ],
          target: "#sync.sync",
        },
      },
      states: {
        restore: {
          invoke: {
            src: "getTreePatchesFromStorage",
            id: "restore",
            onDone: {
              target: "#sync.sync",
              actions: "assignPatchesToContext",
            },
            onError: { target: "idle" },
          },
        },
        idle: {
          entry: "syncPatchesToLocalStorage",
        },
        sync: {
          initial: "initial",
          states: {
            initial: {
              always: [
                {
                  target: "#sync.sync.syncing",
                  cond: "hasPatches",
                },
                {
                  target: "#sync.idle",
                },
              ],
            },
            syncing: {
              invoke: {
                src: "syncFn",
                id: "sync",
                onDone: { actions: "clearPatches", target: "success" },
                onError: { target: "#sync.error" },
              },
            },
            success: {
              after: { 2000: "#sync.sync" },
            },
          },
        },
        error: {
          entry: "syncPatchesToLocalStorage",
          on: {
            retry: {
              target: "idle",
            },
          },
        },
      },
    },
    {
      actions: {
        syncPatchesToLocalStorage: ({ treeId, patches }) => {
          updateTreePatchesInStorage(`${treeId.toString()}:patches`, patches);
        },
        assignPatchesToContext: immerAssign((context, event) => {
          context.patches = event.data;
        }),
        sendPatchesReceived: sendParent("patchesReceived"),
        clearPatches: immerAssign((context, _event) => {
          context.patches = [];
        }),
      },
      services: {
        syncFn: (context) => () => syncFn(context.patches),
        getTreePatchesFromStorage: (context) => async () => {
          const possiblePatches = await localforage.getItem(
            `${context.treeId}:patches`
          );

          const parsedPatches = BuilderTree.Patches.safeParse(possiblePatches);

          if (!parsedPatches.success) return Promise.reject("no patches found");

          return Promise.resolve(parsedPatches.data);
        },
      },
      guards: {
        hasPatches: (context) => context.patches.length > 0,
      },
    }
  );
