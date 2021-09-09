import localForage from "localforage";
import { assign, createMachine, Interpreter } from "xstate";
import {
  addNode,
  deleteNode,
  Events,
  updateNode,
  updateNodeData,
  addRelation,
  updateRelation,
  deleteRelation,
} from "./assignUtils";
import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { Errors } from "io-ts";
import { Tree, TTree } from "../types/Tree";

async function updateTreeInStorage(id: string, tree: TTree) {
  localForage.setItem(id, tree);
}

async function getTreeFromStorage(id: string) {
  function onFailure(error: Errors) {
    return Promise.reject(error);
  }

  function onSuccess(value: TTree) {
    return Promise.resolve(value);
  }

  const possibleTree = await localForage.getItem(id);
  return pipe(possibleTree, Tree.Type.decode, fold(onFailure, onSuccess));
}

export type TreeState =
  | { value: "pending"; context: never }
  | { value: "missing"; context: Context }
  | { value: "idle"; context: Context }
  | { value: "creation"; context: never };

export type sendToTreePayload = Parameters<
  Interpreter<Context, any, Events, TreeState>["send"]
>[0];

export type Context = { id: string } & TTree;

export type TreeService = Interpreter<Context, any, Events, TreeState>;

export const treeMachine = createMachine<Context, Events, TreeState>(
  {
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
            target: "creation",
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
          updateNodeData: {
            target: "sync",
            actions: updateNodeData,
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
        always: {
          target: "idle",
          actions: "createNewTree",
        },
      },
    },
  },
  {
    actions: {
      createNewTree: assign(Tree.createTree),
    },
  }
);
