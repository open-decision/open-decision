import localForage from "localforage";
import { createMachine, Interpreter } from "xstate";
import { TTree } from "../types";
import {
  addEdge,
  addInput,
  addNode,
  deleteEdge,
  deleteInput,
  deleteNode,
  Events,
  foundTree,
  updateEdge,
  updateInput,
  updateNode,
  updateNodeData,
} from "./stateUpdaterFunctions";
import { Context } from "./types";
import { createNewTree } from "./utils";

async function updateTreeInStorage(id: string, tree: TTree) {
  localForage.setItem(id, tree);
}

export type TreeState =
  | { value: "pending"; context: never }
  | { value: "missing"; context: Context }
  | { value: "idle"; context: Context }
  | { value: "creation"; context: never };

export type TreeService = Interpreter<Context, any, Events, TreeState>;

export const treeMachine = createMachine<Context, Events, TreeState>({
  context: createNewTree(),
  id: "tree",
  initial: "pending",
  states: {
    pending: {
      on: {
        foundTree: {
          target: "idle",
          actions: foundTree,
        },
        noTree: { target: "idle" },
      },
    },
    idle: {
      on: {
        addNode: {
          target: "sync",
          actions: addNode,
        },
        updateNode: {
          target: "sync",
          actions: updateNode,
        },
        updateNodeData: {
          target: "sync",
          actions: updateNodeData,
        },
        deleteNode: {
          target: "sync",
          actions: deleteNode,
        },
        addEdge: {
          target: "sync",
          actions: addEdge,
        },
        updateEdge: {
          target: "sync",
          actions: updateEdge,
        },
        deleteEdge: {
          target: "sync",
          actions: deleteEdge,
        },
        addInput: {
          target: "sync",
          actions: addInput,
        },
        updateInput: {
          target: "sync",
          actions: updateInput,
        },
        deleteInput: {
          target: "sync",
          actions: deleteInput,
        },
      },
    },
    sync: {
      always: [
        {
          target: "idle",
          actions: async (context, _event) => {
            await updateTreeInStorage(context.id, context);
          },
        },
      ],
    },
    creation: {
      on: {
        createTree: { target: "idle" },
      },
    },
  },
});
