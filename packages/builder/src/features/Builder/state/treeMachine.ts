import { assign as immerAssign } from "@xstate/immer";
import localForage from "localforage";
import { assign, createMachine, InterpreterFrom, send, spawn } from "xstate";
import { Context, Events } from "./types";
import { BuilderRelation, BuilderTree } from "@open-decision/type-classes";
import produce from "immer";
import { merge } from "remeda";
import { createSyncMachine } from "./syncMachine";

async function updateTreeInStorage(id: string, tree: BuilderTree.TTree) {
  localForage.setItem(id, tree);
}

export type TreeInterpreter = InterpreterFrom<
  ReturnType<typeof createTreeMachine>
>;

export const createTreeMachine = (syncFn: (data: BuilderTree.TTree) => void) =>
  createMachine(
    {
      tsTypes: {} as import("./treeMachine.typegen").Typegen0,
      schema: {
        events: {} as Events,
        context: {} as Context,
      },
      id: "tree",
      initial: "idle",
      context: undefined,
      entry: "spawnSyncMachine",
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
          },
        },
        connecting: {
          on: {
            connect: {
              actions: ["connect", "syncTreeWithLocalStorage", "sendSyncEvent"],
            },
            abortConnect: "idle",
          },
        },
      },
    },
    {
      actions: {
        syncTreeWithLocalStorage: (
          { syncMachineRef: _, ...context },
          _event
        ) => {
          updateTreeInStorage("tree", context);
        },
        addNode: immerAssign((context, { value }) => {
          context.treeData[value.id] = value;

          if (context.startNode === "") context.startNode = value.id;
        }),
        updateNode: immerAssign((context, { id, node }) => {
          const oldElement = context.treeData[id];

          context.treeData[id] = {
            ...oldElement,
            ...node,
          };
        }),
        deleteNode: immerAssign((context, { ids }) => {
          ids.forEach((id) => {
            delete context.treeData[id];
            if (id === context.selectedNodeId) context.selectedNodeId = "";

            // Remove the node from all the targets of other treeData
            for (const key in context.treeData) {
              const node = context.treeData[key];

              for (const key in node.relations) {
                const relation = node.relations[key];

                if (relation.target === id) {
                  delete relation.target;
                }
              }
            }
          });
        }),
        addRelation: assign((context, { nodeId, relation }) => {
          const newRelation = BuilderRelation.create(relation);
          const newContext = produce(context, (draftState) => {
            draftState.treeData[nodeId].relations[newRelation.id] = newRelation;
          });

          if (relation?.target) {
            const circular = BuilderTree.circularConnection(newContext)({
              source: nodeId,
              target: relation.target,
            });

            if (circular) return context;
          }

          return newContext;
        }),
        updateRelation: immerAssign(
          (context, { nodeId, relationId, relation }) => {
            const oldValue = context.treeData[nodeId].relations[relationId];

            context.treeData[nodeId].relations[relationId] = {
              ...oldValue,
              ...relation,
            };
          }
        ),
        deleteRelation: immerAssign((context, { nodeId, relationIds }) => {
          relationIds.forEach((relationId) => {
            delete context.treeData[nodeId].relations[relationId];
          });
        }),
        updateTree: assign((context, { tree }) => {
          return merge(context, tree);
        }),
        selectNode: immerAssign((context, { nodeId }) => {
          context.selectedNodeId = nodeId;
        }),
        selectRelation: immerAssign((context, { id }) => {
          context.selectedRelationId = id;
        }),
        startConnecting: immerAssign((context, { sourceNodeId }) => {
          const connectionOriginNode = context.treeData[sourceNodeId];

          context.connectionSourceNode = connectionOriginNode;

          context.validConnections =
            BuilderTree.getConnectableNodes(connectionOriginNode)(context);
        }),
        connect: assign((context, { target }) => {
          if (context.connectionSourceNode == null) return context;

          const newRelation = BuilderRelation.create({ target });
          const newContext = produce(context, (draftState) => {
            // @ts-expect-error - We are checking that context.connectionSourceNodeId is not undefined above. Typescript cannot infer it.
            draftState.treeData[context.connectionSourceNode.id].relations[
              newRelation.id
            ] = newRelation;

            draftState.connectionSourceNode = undefined;
            draftState.validConnections = undefined;
          });

          const circular = BuilderTree.circularConnection(newContext)({
            source: context.connectionSourceNode.id,
            target: target,
          });

          if (circular) return context;

          return newContext;
        }),
        sendSyncEvent: send(
          ({ syncMachineRef: _, ...context }) => ({
            type: "sync",
            data: context,
          }),
          { to: (context) => context.syncMachineRef }
        ),
        //@ts-expect-error - Not sure what the problem is. Probably something with the experimentell typegen.
        spawnSyncMachine: assign({
          syncMachineRef: () =>
            spawn(createSyncMachine(syncFn), {
              name: "syncMachine",
              sync: true,
            }),
        }),
      },
    }
  );
