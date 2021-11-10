import localForage from "localforage";
import { assign, createMachine, Interpreter } from "xstate";
import {
  addNode,
  deleteNode,
  Events,
  updateNode,
  addRelation,
  updateRelation,
  deleteRelation,
  selectNode,
  createTree,
  updateTree,
  selectRelation,
} from "./assignUtils";
import { BuilderTree } from "@open-decision/type-classes";
import localforage from "localforage";

async function deleteTreeFromStorage(id: string) {
  localforage.removeItem(id);
}

async function updateTreeInStorage(id: string, tree: BuilderTree.TTree) {
  localForage.setItem(id, tree);
}

async function getTreeFromStorage(id: string) {
  const possibleTree = await localForage.getItem(id);
  const parsedTree = BuilderTree.Type.safeParse(possibleTree);

  if (parsedTree.success) return Promise.resolve(parsedTree.data);

  return Promise.reject(parsedTree.error);
}

export type TreeState =
  | { value: "pending"; context: never }
  | { value: "idle"; context: Context }
  | { value: "empty"; context: never };

export type sendToTreePayload = Parameters<
  Interpreter<Context, any, Events, TreeState>["send"]
>[0];

export type Context = BuilderTree.TTree;

export type TreeService = Interpreter<Context, any, Events, TreeState>;
export type SendFn = TreeService["send"];
export type InterpretedTreeState = TreeService["state"];

export const treeMachine = createMachine<Context, Events, TreeState>({
  context: undefined,
  id: "tree",
  initial: "pending",
  states: {
    pending: {
      invoke: {
        id: "getTree",
        src: (_context, _event) => getTreeFromStorage("tree"),
        onDone: {
          target: "idle",
          actions: assign((_context, event) => event.data),
        },
        onError: {
          target: "empty",
        },
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
        addRelation: {
          target: "sync",
          actions: addRelation,
        },
        updateRelation: {
          target: "sync",
          actions: updateRelation,
        },
        deleteRelation: {
          target: "sync",
          actions: deleteRelation,
        },
        updateTree: {
          target: "sync",
          actions: updateTree,
        },
        clearTree: {
          target: "empty",
        },
        selectNode: {
          target: "sync",
          actions: selectNode,
        },
        selectRelation: {
          target: "sync",
          actions: selectRelation,
        },
      },
    },
    sync: {
      always: {
        target: "idle",
        actions: async (context, _event) => {
          await updateTreeInStorage("tree", context);
        },
      },
    },
    empty: {
      entry: async () => {
        await deleteTreeFromStorage("tree");
      },
      on: {
        createTree: {
          target: "sync",
          actions: createTree,
        },
      },
    },
  },
});
