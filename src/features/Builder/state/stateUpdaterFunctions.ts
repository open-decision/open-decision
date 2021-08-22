import { assign } from "@xstate/immer";
import { fold } from "fp-ts/lib/Either";
import { Connection, Edge } from "react-flow-renderer";
import { merge, pipe } from "remeda";
import { TEdge, TInput, TNode, TTree } from "../types";
import { Context } from "./types";
import { createEdge } from "./utils";
import { nanoid } from "nanoid/non-secure";

type UpdateElementData = Partial<TNode>;

export type UpdateElementFunction = (data: UpdateElementData) => void;

export type CreateTreeEvent = { type: "createTree" };
export type NoTreeEvent = { type: "noTree" };

export type Events =
  | FoundTreeEvent
  | NoTreeEvent
  | CreateTreeEvent
  | AddNodeEvent
  | UpdateNodeEvent
  | DeleteNodeEvent
  | AddEdgeEvent
  | UpdateEdgeEvent
  | DeleteEdgeEvent
  | AddInputEvent
  | UpdateInputEvent
  | DeleteInputEvent;

export type FoundTreeEvent = { type: "foundTree"; tree: TTree };
export const foundTree = assign(
  (context: Context, { tree }: FoundTreeEvent) => {
    context.tree = tree;
  }
);

export type AddNodeEvent = { type: "addNode"; value: TNode };
export const addNode = assign((context: Context, { value }: AddNodeEvent) => {
  context.tree.state.elements.nodes[value.id] = value;
});

export type UpdateNodeEvent = {
  type: "updateNode";
  id: string;
  data: UpdateElementData;
};
export const updateNode = assign(
  (context: Context, { id, data }: UpdateNodeEvent) => {
    const oldElement = context.tree.state.elements.nodes[id];

    context.tree.state.elements.nodes[id] = {
      ...oldElement,
      ...data,
    };
  }
);

export type DeleteNodeEvent = { type: "deleteNode"; ids: string[] };
export const deleteNode = assign(
  (context: Context, { ids }: DeleteNodeEvent) => {
    ids.forEach((id) => {
      delete context.tree.state.elements.nodes[id];
    });
  }
);

export type AddEdgeEvent = {
  type: "addEdge";
  connection: Edge<any> | Connection;
};
export const addEdge = assign(
  (context: Context, { connection }: AddEdgeEvent) => {
    pipe(
      connection,
      createEdge(context.tree.state.elements),
      fold(
        (errors) => console.warn(errors),
        (value) => {
          context.tree.state.elements.edges[value.id] = value;
        }
      )
    );
  }
);

export type UpdateEdgeEvent = {
  type: "updateEdge";
  id: string;
  data: Partial<TEdge>;
};
export const updateEdge = assign(
  (context: Context, { id, data }: UpdateEdgeEvent) => {
    const oldEdgeData = context.tree.state.elements.edges[id];
    context.tree.state.elements.edges[id] = merge(oldEdgeData, data);
  }
);

export type DeleteEdgeEvent = {
  type: "deleteEdge";
  id: string;
};
export const deleteEdge = assign(
  (context: Context, { id }: DeleteEdgeEvent) => {
    delete context.tree.state.elements.edges[id];
  }
);

export type AddInputEvent = {
  type: "addInput";
  nodeId: string;
  input?: Partial<TInput>;
};

export const addInput = assign(
  (context: Context, { nodeId, input }: AddInputEvent) => {
    const position =
      context.tree.state.elements.nodes[nodeId].content.inputs.length + 1;
    context.tree.state.elements.nodes[nodeId].content.inputs.push({
      id: nanoid(5),
      position,
      value: "",
      ...input,
    });
  }
);
export type UpdateInputEvent = {
  type: "updateInput";
  nodeId: string;
  inputId: string;
  input: Partial<TInput>;
};

export const updateInput = assign(
  (context: Context, { nodeId, input, inputId }: UpdateInputEvent) => {
    const inputIndex = context.tree.state.elements.nodes[
      nodeId
    ].content.inputs.findIndex((input) => input.id === inputId);
    const oldInput =
      context.tree.state.elements.nodes[nodeId].content.inputs[inputIndex];

    context.tree.state.elements.nodes[nodeId].content.inputs[inputIndex] =
      merge(oldInput, input);
  }
);

export type DeleteInputEvent = {
  type: "deleteInput";
  nodeId: string;
  inputId: string;
};

export const deleteInput = assign(
  (context: Context, { nodeId, inputId }: DeleteInputEvent) => {
    const inputIndex = context.tree.state.elements.nodes[
      nodeId
    ].content.inputs.findIndex((input) => input.id === inputId);

    context.tree.state.elements.nodes[nodeId].content.inputs.splice(
      inputIndex,
      1
    );
  }
);
