import { TEdge, TElements, TNode, TTree } from "../types";
import { createMachine } from "xstate";
import { assign } from "@xstate/immer";
import { Connection, Edge, Elements, isEdge } from "react-flow-renderer";
import { Either, left, right } from "fp-ts/lib/Either";
import { exampleNodeTypes, examplePortTypes } from "../tests/nodes";
import localForage from "localforage";

async function updateTreeInStorage(id: string, tree: TTree) {
  localForage.setItem(id, tree);
}

function createNewTree(): TTree {
  return {
    config: {
      nodeTypes: exampleNodeTypes,
      portTypes: examplePortTypes,
    },
    state: {
      elements: [],
      treeName: "Unbenannt",
    },
  };
}

const getEdgeId = ({
  source,
  sourceHandle,
  target,
  targetHandle,
}: Connection): string =>
  `reactflow__edge-${source}${sourceHandle}-${target}${targetHandle}`;

const connectionExists = (edge: Edge, elements: TElements) => {
  return elements.some(
    (el) =>
      isEdge(el) &&
      el.source === edge.source &&
      el.target === edge.target &&
      (el.sourceHandle === edge.sourceHandle ||
        (!el.sourceHandle && !edge.sourceHandle)) &&
      (el.targetHandle === edge.targetHandle ||
        (!el.targetHandle && !edge.targetHandle))
  );
};

export const createEdge =
  (elements: TElements) =>
  (edgeParams: Connection | Edge<any>): Either<string, TEdge> => {
    if (!edgeParams.source || !edgeParams.target) {
      console.warn("Can't create edge. An edge needs a source and a target.");
      return left("Can't create edge. An edge needs a source and a target.");
    }

    let edge: TEdge;
    if (isEdge(edgeParams)) {
      edge = { ...edgeParams, label: "" };
    } else {
      edge = {
        ...edgeParams,
        id: getEdgeId(edgeParams),
      } as TEdge;
    }

    if (connectionExists(edge, elements)) {
      return left("Connection already exists");
    }

    return right(edge);
  };

type Events =
  | { type: "resolve"; tree: TTree }
  | { type: "reject" }
  | { type: "createTree" }
  | { type: "addElement"; value: TEdge | TNode }
  | {
      type: "updateElement";
      value: { id: string; data: Partial<TEdge> | Partial<TNode> };
    }
  | { type: "deleteElement"; elements: Elements<any> };

type Context = { id: string; tree: TTree };

type State =
  | { value: "pending"; context: never }
  | { value: "missing"; context: Context }
  | { value: "idle"; context: Context }
  | { value: "creation"; context: never };

export const treeMachine = createMachine<Context, Events, State>({
  context: { id: "tree", tree: createNewTree() },
  id: "tree",
  initial: "pending",
  states: {
    pending: {
      on: {
        resolve: {
          target: "sync",
          actions: assign((context, { tree }) => {
            context.tree = tree;
          }),
        },
        reject: { target: "sync" },
      },
    },
    idle: {
      on: {
        addElement: {
          target: "sync",
          actions: assign((context, { value }) => {
            context.tree.state.elements.push(value);
          }),
        },
        updateElement: {
          target: "sync",
          actions: assign((context, { value: { id, data } }) => {
            const existingElementIndex = context.tree.state.elements.findIndex(
              (element) => element.id === id
            );
            const oldElement =
              context.tree.state.elements[existingElementIndex];

            context.tree.state.elements[existingElementIndex] = {
              ...oldElement,
              ...data,
            };
          }),
        },
        deleteElement: {
          target: "sync",
          actions: assign((context, { elements }) => {
            elements.forEach((element) => {
              const elementIndex = context.tree.state.elements.findIndex(
                (currentElement) => currentElement.id === element.id
              );

              context.tree.state.elements.splice(elementIndex, 1);
            });
          }),
        },
      },
    },
    sync: {
      always: [
        {
          target: "idle",
          actions: async (context, _event) => {
            await updateTreeInStorage(context.id, context.tree);
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
