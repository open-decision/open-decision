import { assign as immerAssign } from "@xstate/immer";
import { nanoid } from "nanoid/non-secure";
import { Context, sendToTreePayload } from "./treeMachine";
import * as Node from "../types/Node";
import { merge } from "remeda";

export type CreateTreeEvent = { type: "createTree" };

export type Events =
  | CreateTreeEvent
  | AddNodeEvent
  | UpdateNodeEvent
  | UpdateNodeDataEvent
  | DeleteNodeEvent
  | AddRelationEvent
  | UpdateRelationEvent
  | DeleteRelationEvent;

export type AddNodeEvent = { type: "addNode"; value: Node.TNode };
export const addNode = immerAssign(
  (context: Context, { value }: AddNodeEvent) => {
    context.nodes[value.id] = value;
  }
);

export type UpdateNodeEvent = {
  type: "updateNode";
  id: string;
  node: Omit<Partial<Node.TNode>, "data">;
};
export const updateNode = immerAssign(
  (context: Context, { id, node }: UpdateNodeEvent) => {
    const oldElement = context.nodes[id];

    context.nodes[id] = {
      ...oldElement,
      ...node,
    };
  }
);

export type UpdateNodeDataEvent = {
  type: "updateNodeData";
  nodeId: string;
  data: Partial<Node.TNodeData>;
};
export const updateNodeData = immerAssign(
  (context: Context, { nodeId, data }: UpdateNodeDataEvent) => {
    const oldElement = context.nodes[nodeId];

    context.nodes[nodeId] = {
      ...oldElement,
      data: {
        ...oldElement.data,
        ...data,
      },
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

export type AddRelationEvent = {
  type: "addRelation";
  nodeId: string;
  value?: Omit<Partial<Node.TRelation>, "id">;
};

export const addRelation = immerAssign(
  (context: Context, { nodeId, value }: AddRelationEvent) => {
    const id = nanoid(5);

    context.nodes[nodeId].data.relations[id] = { id, ...value };
  }
);

export type UpdateRelationEvent = {
  type: "updateRelation";
  nodeId: string;
  relationId: string;
  value?: Partial<Node.TRelation>;
};

export const updateRelation = immerAssign(
  (context: Context, { nodeId, relationId, value }: UpdateRelationEvent) => {
    const oldValue = context.nodes[nodeId].data.relations[relationId];

    context.nodes[nodeId].data.relations[relationId] = merge(oldValue, value);
  }
);

export type DeleteRelationEvent = {
  type: "deleteRelation";
  nodeId: string;
  relationIds: string[];
};

export const deleteRelation = immerAssign(
  (context: Context, { nodeId, relationIds }: DeleteRelationEvent) => {
    relationIds.forEach((relationId) => {
      delete context.nodes[nodeId].data.relations[relationId];
    });
  }
);

export function createNewAssociatedNode(node: Node.TNode): sendToTreePayload {
  const id = nanoid(5);
  const position = { x: node.position.x, y: node.position.y + 80 };

  return [
    {
      type: "addNode",
      value: {
        id,
        position,
        type: "default",
        data: { relations: {}, content: [], label: "Neuer Knoten" },
      },
    },
    {
      type: "addRelation",
      nodeId: node.id,
      value: {
        value: "",
        target: id,
      },
    },
  ];
}
