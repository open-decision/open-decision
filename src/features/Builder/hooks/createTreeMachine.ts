import * as localForage from "localforage";
import { TEdge, TElements, TNode, Tree, TTree } from "../types";
import { createMachine, Interpreter, StateMachine } from "xstate";
import { pipe } from "fp-ts/lib/function";
import { assign } from "@xstate/immer";
import { Connection, Edge, Elements, isEdge } from "react-flow-renderer";
import { Either, left, right } from "fp-ts/lib/Either";

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

export function getTreeFromStorage(id: string) {
  localForage.getItem(id).then(function validateTree(unknownTree) {
    return pipe(Tree.decode(unknownTree));
  });
}

type Events =
  | { type: "resolve" }
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
  | { value: "missing"; context: never }
  | { value: "idle"; context: { tree: TTree; id: string } }
  | { value: "creation"; context: never };

export type TreeMachine = StateMachine<Context, any, Events, State>;
export type InterpretedTreeMachine = Interpreter<Context, any, Events, State>;

export function createTreeMachine(initialContext: Context): TreeMachine {
  return createMachine<Context, Events, State>({
    context: initialContext,
    id: "tree",
    initial: "pending",
    states: {
      pending: {
        on: {
          resolve: { target: "idle" },
          reject: { target: "missing" },
        },
      },
      missing: {},
      idle: {
        on: {
          addElement: {
            actions: assign((context, { value }) => {
              context.tree.state.elements.push(value);
            }),
          },
          updateElement: {
            actions: assign((context, { value: { id, data } }) => {
              const existingElementIndex =
                context.tree.state.elements.findIndex(
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
      creation: {
        on: {
          createTree: { target: "idle" },
        },
      },
    },
  });
}
