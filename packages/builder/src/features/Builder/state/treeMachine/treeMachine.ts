import { assign as immerAssign } from "@xstate/immer";
import localForage from "localforage";
import { assign, createMachine, InterpreterFrom, send, spawn } from "xstate";
import { Context, Events } from "../types";
import { BuilderTree } from "@open-decision/type-classes";
import { createSyncMachine } from "../syncMachine/syncMachine";
import { applyPatches } from "immer";
import { addPatches } from "../utils";
import { PatchTreeMutation } from "features/Data/generated/graphql";

async function updateTreeInStorage(id: string, tree: BuilderTree.TTree) {
  localForage.setItem(id, tree);
}

export type TreeInterpreter = InterpreterFrom<
  ReturnType<typeof createTreeMachine>
>;

export const createTreeMachine = (
  tree: BuilderTree.TTree,
  syncFn: (patches: BuilderTree.TPatch[]) => Promise<PatchTreeMutation>
) =>
  createMachine(
    {
      tsTypes: {} as import("./treeMachine.typegen").Typegen0,
      schema: {
        events: {} as Events,
        context: {} as Context,
      },
      id: "tree",
      initial: "idle",
      context: {
        tree,
        patches: [],
        undoRedoStack: [],
        undoRedoPosition: 0,
        connectionSourceNode: undefined,
        validConnections: undefined,
        syncMachineRef: null,
      },
      entry: "spawnSyncMachine",
      on: {
        patchesReceived: { actions: "clearPatches" },
      },
      states: {
        idle: {
          on: {
            addNode: {
              actions: ["addNode", "syncTreeWithLocalStorage", "sendSyncEvent"],
            },
            updateNode: {
              actions: [
                "updateNode",
                "syncTreeWithLocalStorage",
                "sendSyncEvent",
              ],
            },
            deleteNode: {
              actions: [
                "deleteNode",
                "syncTreeWithLocalStorage",
                "sendSyncEvent",
              ],
            },
            addRelation: {
              actions: [
                "addRelation",
                "syncTreeWithLocalStorage",
                "sendSyncEvent",
              ],
            },
            updateRelation: {
              actions: [
                "updateRelation",
                "syncTreeWithLocalStorage",
                "sendSyncEvent",
              ],
            },
            deleteRelation: {
              actions: [
                "deleteRelation",
                "syncTreeWithLocalStorage",
                "sendSyncEvent",
              ],
            },
            updateTree: {
              actions: [
                "updateTree",
                "syncTreeWithLocalStorage",
                "sendSyncEvent",
              ],
            },
            selectNode: {
              actions: ["selectNode", "syncTreeWithLocalStorage"],
            },
            selectRelation: {
              actions: ["selectRelation", "syncTreeWithLocalStorage"],
            },
            startConnecting: {
              target: "connecting",
              actions: "startConnecting",
            },
            undo: {
              actions: ["undo", "syncTreeWithLocalStorage", "sendSyncEvent"],
            },
            redo: {
              actions: ["redo", "syncTreeWithLocalStorage", "sendSyncEvent"],
            },
          },
        },
        connecting: {
          on: {
            connect: {
              actions: [
                "connect",
                "syncTreeWithLocalStorage",
                "sendSyncEvent",
                "cleanUpConnect",
              ],
              target: "idle",
            },
            abortConnect: { target: "idle", actions: ["cleanUpConnect"] },
          },
        },
      },
    },
    {
      actions: {
        syncTreeWithLocalStorage: ({ tree }, _event) => {
          updateTreeInStorage(tree.id.toString(), tree);
        },
        addNode: immerAssign((context, event) => {
          const [newTree, patches, inversePatches] = BuilderTree.addNode(
            event.node
          )(context.tree);

          context.tree = newTree;
          addPatches(context, patches, inversePatches);
        }),
        undo: immerAssign((context, _event) => {
          //We get the inversePatch based on the undoRedoPosition. If there is nothing at the index
          const [, inversePatch] = context.undoRedoStack[
            context.undoRedoPosition
          ] ?? [undefined, undefined];

          if (!inversePatch) return context;

          context.undoRedoPosition += 1;
          inversePatch.forEach((patch) => context.patches.unshift(patch));

          return applyPatches(context.tree, inversePatch);
        }),
        redo: immerAssign((context, _event) => {
          const redoPosition = context.undoRedoPosition - 1;
          const [patch] = context.undoRedoStack[redoPosition] ?? [
            undefined,
            undefined,
          ];

          if (!patch) return context;
          context.undoRedoPosition -= 1;
          patch.forEach((patch) => context.patches.unshift(patch));

          return applyPatches(context.tree, patch);
        }),
        updateNode: immerAssign((context, event) => {
          const [newTree, patches, inversePatches] = BuilderTree.updateNode(
            event.node
          )(context.tree);

          context.tree = newTree;
          addPatches(context, patches, inversePatches);
        }),
        deleteNode: immerAssign((context, event) => {
          const [newTree, patches, inversePatches] = BuilderTree.deleteNodes(
            event.ids
          )(context.tree);

          context.tree = newTree;
          addPatches(context, patches, inversePatches);
        }),
        addRelation: immerAssign((context, event) => {
          const [newTree, patches, inversePatches] = BuilderTree.addRelation(
            event.nodeId,
            event.relation
          )(context.tree);

          context.tree = newTree;
          addPatches(context, patches, inversePatches);
        }),
        updateRelation: immerAssign((context, event) => {
          const [newTree, patches, inversePatches] = BuilderTree.updateRelation(
            event.nodeId,
            event.relation
          )(context.tree);

          context.tree = newTree;
          addPatches(context, patches, inversePatches);
        }),
        deleteRelation: immerAssign((context, event) => {
          const [newTree, patches, inversePatches] =
            BuilderTree.deleteRelations(
              event.nodeId,
              event.relationIds
            )(context.tree);

          context.tree = newTree;
          addPatches(context, patches, inversePatches);
        }),
        updateTree: immerAssign((context, event) =>
          BuilderTree.updateTree(event.tree)(context.tree)
        ),
        selectNode: immerAssign((context, { nodeId }) => {
          context.tree.selectedNodeId = nodeId;
        }),
        selectRelation: immerAssign((context, { id }) => {
          context.tree.selectedRelationId = id;
        }),
        startConnecting: immerAssign((context, { sourceNodeId }) => {
          const connectionOriginNode = context.tree.treeData[sourceNodeId];

          context.connectionSourceNode = connectionOriginNode;

          context.validConnections = BuilderTree.getConnectableNodes(
            connectionOriginNode
          )(context.tree);
        }),
        connect: immerAssign((context, { target }) => {
          if (context.connectionSourceNode == null) return context.tree;

          const [newTree, patches, inversePatches] = BuilderTree.addRelation(
            context.connectionSourceNode.id,
            { target }
          )(context.tree);

          context.tree = newTree;
          addPatches(context, patches, inversePatches);
        }),
        cleanUpConnect: immerAssign((context) => {
          context.connectionSourceNode = null;
          context.validConnections = null;
        }),
        clearPatches: immerAssign((context) => {
          context.patches = [];
        }),
        sendSyncEvent: send(
          (context) => ({
            type: "sync",
            data: context.patches,
          }),
          { to: "syncMachine" }
        ),
        spawnSyncMachine: assign({
          syncMachineRef: (context, _event) =>
            spawn(createSyncMachine(context.tree.id, syncFn), {
              name: "syncMachine",
              sync: true,
            }),
        }),
      },
    }
  );
