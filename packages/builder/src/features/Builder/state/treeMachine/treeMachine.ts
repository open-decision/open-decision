import { assign as immerAssign } from "@xstate/immer";
import { assign, createMachine, InterpreterFrom, send, spawn } from "xstate";
import { Context, Events } from "../types";
import { BuilderTree } from "@open-decision/type-classes";
import { createSyncMachine } from "../syncMachine/syncMachine";
import { applyPatches, Draft } from "immer";
import { PatchTreeMutation } from "features/Data/generated/graphql";
import { TreeUpdateReturn } from "@open-decision/type-classes/src/Tree/BuilderTree";
import equal from "fast-deep-equal";

/** This function causes a side effect in the context of an immerAssign. It encapsulates the update of the tree and assignment of patches to the context.  */
const stateUpdaterWithPatches =
  (
    /** Provide the function that takes the tree and returns the tuple of an updated tree, patches and the inversePatches. */
    stateUpdater: (tree: BuilderTree.TTree) => TreeUpdateReturn
  ) =>
  (context: Draft<Context>) => {
    const [newTree, patches, inversePatches] = stateUpdater(context.tree);

    context.tree = newTree;
    context.patches = [...patches, ...context.patches];
    context.undoRedoStack.unshift([patches, inversePatches]);
  };

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
              actions: ["addNode", "sendSyncEvent"],
            },
            updateNode: {
              actions: ["updateNode", "sendSyncEvent"],
            },
            updateNodeName: {
              actions: ["updateNodeName", "mergePatch", "sendSyncEvent"],
            },
            updateNodePosition: {
              actions: ["updateNodePosition", "sendSyncEvent"],
            },
            updateNodeContent: {
              actions: ["updateNodeContent", "sendSyncEvent"],
            },
            updateNodeRelations: {
              actions: ["updateNodeRelations", "sendSyncEvent"],
            },
            deleteNode: {
              actions: ["deleteNode", "sendSyncEvent"],
            },
            addRelation: {
              actions: ["addRelation", "sendSyncEvent"],
            },
            updateRelation: {
              actions: ["updateRelation", "sendSyncEvent"],
            },
            updateRelationAnswer: {
              actions: ["updateRelationAnswer", "mergePatch", "sendSyncEvent"],
            },
            updateRelationTarget: {
              actions: ["updateRelationTarget", "sendSyncEvent"],
            },
            deleteRelation: {
              actions: ["deleteRelation", "sendSyncEvent"],
            },
            updateTree: {
              actions: ["updateTree", "sendSyncEvent"],
            },
            selectNode: {
              actions: ["selectNode"],
            },
            selectRelation: {
              actions: ["selectRelation"],
            },
            startConnecting: {
              target: "connecting",
              actions: "startConnecting",
            },
            undo: {
              actions: ["undo", "sendSyncEvent"],
            },
            redo: {
              actions: ["redo", "sendSyncEvent"],
            },
          },
        },
        connecting: {
          on: {
            connect: {
              actions: ["connect", "sendSyncEvent", "cleanUpConnect"],
              target: "idle",
            },
            abortConnect: { target: "idle", actions: ["cleanUpConnect"] },
          },
        },
      },
    },
    {
      actions: {
        addNode: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.addNode(event.node))(context)
        ),
        mergePatch: immerAssign((context) => {
          // Only if there are at least two patches does it make sense to merge patches
          if (context.undoRedoStack.length <= 1) return;

          // We destructure the relevant patches from the the first and second items of the undoRedoStack. We do not mutate it, because we only want
          // to do that if the paths of the patches are equal.
          const [currentPatch] = context.undoRedoStack[0][0];
          const [[previousPatch], [previousInversePatch]] =
            context.undoRedoStack[1];

          // We only merge patches if the current and previous patches have the same path.
          if (equal(currentPatch.path, previousPatch.path)) {
            // Now we replace the first element of the undoRedoStack with our new PatchTuple.
            // We combine the current patch with the previousInversePatch. This in effect means that we are
            // skipping the intermediate (previous) patch when using undo/redo.
            context.undoRedoStack.splice(0, 2, [
              [currentPatch],
              [previousInversePatch],
            ]);
          }
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
        updateNode: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.updateNode(event))(context)
        ),
        updateNodeName: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.updateNodeName(event))(context)
        ),
        updateNodePosition: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.updateNodePosition(event))(
            context
          )
        ),
        updateNodeContent: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.updateNodeContent(event))(context)
        ),
        updateNodeRelations: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.updateNodeRelations(event))(
            context
          )
        ),
        deleteNode: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.deleteNodes(event.ids))(context)
        ),
        addRelation: immerAssign((context, event) =>
          stateUpdaterWithPatches(
            BuilderTree.addRelation(event.nodeId, event.relation)
          )(context)
        ),
        updateRelation: immerAssign((context, event) =>
          stateUpdaterWithPatches(
            BuilderTree.updateRelation(event.nodeId, event.relation)
          )(context)
        ),
        updateRelationAnswer: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.updateRelationAnswer(event))(
            context
          )
        ),
        updateRelationTarget: immerAssign((context, event) =>
          stateUpdaterWithPatches(BuilderTree.updateRelationTarget(event))(
            context
          )
        ),
        deleteRelation: immerAssign((context, event) =>
          stateUpdaterWithPatches(
            BuilderTree.deleteRelations(event.nodeId, event.relationIds)
          )(context)
        ),
        updateTree: immerAssign((context, event) =>
          BuilderTree.updateTree(event.tree)(context.tree)
        ),
        selectNode: immerAssign((context, { nodeId }) => {
          context.tree.treeData.selectedNodeId = nodeId;
        }),
        selectRelation: immerAssign((context, { id }) => {
          context.tree.treeData.selectedRelationId = id;
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

          stateUpdaterWithPatches(
            BuilderTree.addRelation(context.connectionSourceNode.id, { target })
          )(context);
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
