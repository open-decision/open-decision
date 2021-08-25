import { assign as immerAssign } from "@xstate/immer";
import { fold } from "fp-ts/lib/Either";
import { Connection, Edge } from "react-flow-renderer";
import { merge, pipe } from "remeda";
import { TEdge, TInput, TNode, TTree } from "../types";
import { Context } from "./types";
import { createEdge } from "./utils";
import { nanoid } from "nanoid/non-secure";
import { assign } from "xstate";

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
    return (context = tree);
  }
);

export type AddNodeEvent = { type: "addNode"; value: TNode };
export const addNode = immerAssign(
  (context: Context, { value }: AddNodeEvent) => {
    context.nodes[value.id] = value;
  }
);

export type UpdateNodeEvent = {
  type: "updateNode";
  id: string;
  data: UpdateElementData;
};
export const updateNode = immerAssign(
  (context: Context, { id, data }: UpdateNodeEvent) => {
    const oldElement = context.nodes[id];

    context.nodes[id] = {
      ...oldElement,
      ...data,
    };
  }
);

export type DeleteNodeEvent = { type: "deleteNode"; ids: string[] };
export const deleteNode = immerAssign(
  (context: Context, { ids }: DeleteNodeEvent) => {
    ids.forEach((id) => {
      delete context.nodes[id];
    });
  }
);

export type AddEdgeEvent = {
  type: "addEdge";
  connection: Edge<any> | Connection;
};
export const addEdge = immerAssign(
  (context: Context, { connection }: AddEdgeEvent) => {
    pipe(
      connection,
      createEdge(context.edges),
      fold(
        (errors) => console.warn(errors),
        (value) => {
          context.edges[value.id] = value;
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
export const updateEdge = immerAssign(
  (context: Context, { id, data }: UpdateEdgeEvent) => {
    const oldEdgeData = context.edges[id];
    context.edges[id] = merge(oldEdgeData, data);
  }
);

export type DeleteEdgeEvent = {
  type: "deleteEdge";
  id: string;
};
export const deleteEdge = immerAssign(
  (context: Context, { id }: DeleteEdgeEvent) => {
    delete context.edges[id];
  }
);

export type AddInputEvent = {
  type: "addInput";
  nodeId: string;
  input?: Partial<TInput>;
};

export const addInput = immerAssign(
  (context: Context, { nodeId, input }: AddInputEvent) => {
    const position = context.nodes[nodeId].inputs.length + 1;
    context.nodes[nodeId].inputs.push({
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

export const updateInput = immerAssign(
  (context: Context, { nodeId, input, inputId }: UpdateInputEvent) => {
    const inputIndex = context.nodes[nodeId].inputs.findIndex(
      (input) => input.id === inputId
    );
    const oldInput = context.nodes[nodeId].inputs[inputIndex];

    context.nodes[nodeId].inputs[inputIndex] = merge(oldInput, input);
  }
);

export type DeleteInputEvent = {
  type: "deleteInput";
  nodeId: string;
  inputId: string;
};

export const deleteInput = immerAssign(
  (context: Context, { nodeId, inputId }: DeleteInputEvent) => {
    const inputIndex = context.nodes[nodeId].inputs.findIndex(
      (input) => input.id === inputId
    );

    context.nodes[nodeId].inputs.splice(inputIndex, 1);
  }
);
