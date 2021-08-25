import { TTree } from "../types";
import { createMachine, Interpreter } from "xstate";
import localForage from "localforage";
import { createNewTree } from "./utils";
import { Context } from "./types";
import {
  addNode,
  addEdge,
  deleteNode,
  Events,
  foundTree,
  updateNode,
  updateEdge,
  deleteEdge,
  addInput,
  updateInput,
  deleteInput,
} from "./stateUpdaterFunctions";

async function updateTreeInStorage(id: string, tree: TTree) {
  localForage.setItem(id, tree);
}

type State =
  | { value: "pending"; context: never }
  | { value: "missing"; context: Context }
  | { value: "idle"; context: Context }
  | { value: "creation"; context: never };

export type TreeService = Interpreter<Context, any, Events, State>;

export const treeMachine = createMachine<Context, Events, State>({
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
