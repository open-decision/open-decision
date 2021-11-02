import { assign as immerAssign } from "@xstate/immer";
import { nanoid } from "nanoid/non-secure";
import { Context } from "./treeMachine";
import * as Node from "../types/Node";
import { Tree } from "@open-decision/type-classes";
import produce from "immer";
import { assign } from "xstate";
import { nodeHeight } from "../utilities/constants";
import { DeepPartial } from "utility-types";
import { merge } from "remeda";

export type Events =
  | AddNodeEvent
  | UpdateNodeEvent
  | UpdateNodeDataEvent
  | DeleteNodeEvent
  | AddRelationEvent
  | UpdateRelationEvent
  | DeleteRelationEvent
  | ClearTreeEvent
  | SelectNodeEvent
  | CreateTreeEvent
  | UpdateTreeEvent
  | SelectRelationEvent;

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
      if (id === context.selectedNodeId) context.selectedNodeId = "";

      // Remove the node from all the targets of other nodes
      for (const key in context.nodes) {
        const node = context.nodes[key];

        for (const key in node.data.relations) {
          const relation = node.data.relations[key];

          if (relation.target === id) {
            delete relation.target;
          }
        }
      }
    });
  }
);

export type AddRelationEvent = {
  type: "addRelation";
  nodeId: string;
  value?: Omit<Partial<Node.TRelation>, "id">;
};

const produceRelation = (
  context: Context,
  { nodeId, value }: AddRelationEvent
) =>
  produce(context, (draftState) => {
    const id = nanoid(5);
    draftState.nodes[nodeId].data.relations[id] = { id, ...value };
  });

export const addRelation = assign(
  (context: Context, event: AddRelationEvent) => {
    const newContext = produceRelation(context, event);

    if (event.value?.target) {
      const circular = Tree.circularConnection(newContext)({
        source: event.nodeId,
        target: event.value.target,
      });

      if (circular) return context;
    }

    return newContext;
  }
);

export type UpdateRelationEvent = {
  type: "updateRelation";
  nodeId: string;
  relationId: string;
  relation?: Partial<Node.TRelation>;
};

export const updateRelation = immerAssign(
  (context: Context, { nodeId, relationId, relation }: UpdateRelationEvent) => {
    const oldValue = context.nodes[nodeId].data.relations[relationId];

    context.nodes[nodeId].data.relations[relationId] = {
      ...oldValue,
      ...relation,
    };
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

export function createNewAssociatedNode(
  node: Node.TNode,
  newNodeData: Partial<Node.TNode["data"]>
): Node.TNode {
  const id = nanoid(5);
  const deplacement = Object.values(node.data.relations).length;
  const position = {
    x: node.position.x + 5 * deplacement,
    y: node.position.y + nodeHeight + nodeHeight / 3 + 5 * deplacement,
  };

  const newNode = {
    id,
    position,
    type: "customNode",
    data: {
      relations: {},
      content: [],
      label: "Neue Node",
      ...newNodeData,
    },
  };

  return newNode;
}

type ClearTreeEvent = { type: "clearTree" };

type SelectNodeEvent = { type: "selectNode"; nodeId: string };

export const selectNode = immerAssign(
  (context: Context, { nodeId }: SelectNodeEvent) => {
    context.selectedNodeId = nodeId;
  }
);

type CreateTreeEvent = { type: "createTree"; name: string };

export const createTree = assign(
  (context: Context, { name }: CreateTreeEvent) => Tree.create(name)
);

type UpdateTreeEvent = {
  type: "updateTree";
  tree: DeepPartial<Pick<Tree.TTree, "config" | "treeName">>;
};
export const updateTree = assign(
  (context: Context, { tree }: UpdateTreeEvent) => merge(context, tree)
);

type SelectRelationEvent = { type: "selectRelation"; id: string };

export const selectRelation = immerAssign(
  (context: Context, { id }: SelectRelationEvent) => {
    context.selectedRelation = id;
  }
);
