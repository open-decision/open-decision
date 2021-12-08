import { assign as immerAssign } from "@xstate/immer";
import { Context } from "./treeMachine";
import { assign } from "xstate";
import { DeepPartial } from "utility-types";
import { merge } from "remeda";
import {
  BuilderTree,
  BuilderNode,
  BuilderRelation,
} from "@open-decision/type-classes";
import produce from "immer";

export type Events =
  | AddNodeEvent
  | UpdateNodeEvent
  | DeleteNodeEvent
  | AddRelationEvent
  | UpdateRelationEvent
  | DeleteRelationEvent
  | ClearTreeEvent
  | SelectNodeEvent
  | CreateTreeEvent
  | UpdateTreeEvent
  | SelectRelationEvent
  | LoadTreeEvent;

export type AddNodeEvent = { type: "addNode"; value: BuilderNode.TNode };
export const addNode = immerAssign(
  (context: Context, { value }: AddNodeEvent) => {
    context.nodes[value.id] = value;

    if (context.startNode === "") context.startNode = value.id;
  }
);

export type UpdateNodeEvent = {
  type: "updateNode";
  id: string;
  node: Partial<BuilderNode.TNode>;
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

export type DeleteNodeEvent = { type: "deleteNode"; ids: string[] };
export const deleteNode = immerAssign(
  (context: Context, { ids }: DeleteNodeEvent) => {
    ids.forEach((id) => {
      delete context.nodes[id];
      if (id === context.selectedNodeId) context.selectedNodeId = "";

      // Remove the node from all the targets of other nodes
      for (const key in context.nodes) {
        const node = context.nodes[key];

        for (const key in node.relations) {
          const relation = node.relations[key];

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
  relation?: Omit<BuilderRelation.TRelation, "id">;
};

export const addRelation = assign(
  (context: Context, { nodeId, relation }: AddRelationEvent) => {
    const newRelation = BuilderRelation.create(relation);
    const newContext = produce(context, (draftState) => {
      draftState.nodes[nodeId].relations[newRelation.id] = newRelation;
    });

    if (relation?.target) {
      const circular = BuilderTree.circularConnection(newContext)({
        source: nodeId,
        target: relation.target,
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
  relation?: Partial<BuilderRelation.TRelation>;
};

export const updateRelation = immerAssign(
  (context: Context, { nodeId, relationId, relation }: UpdateRelationEvent) => {
    const oldValue = context.nodes[nodeId].relations[relationId];

    context.nodes[nodeId].relations[relationId] = {
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
      delete context.nodes[nodeId].relations[relationId];
    });
  }
);

type ClearTreeEvent = { type: "clearTree" };

type SelectNodeEvent = { type: "selectNode"; nodeId: string };

export const selectNode = immerAssign(
  (context: Context, { nodeId }: SelectNodeEvent) => {
    context.selectedNodeId = nodeId;
  }
);

type CreateTreeEvent = { type: "createTree"; name: string };

export const createTree = assign((_: Context, { name }: CreateTreeEvent) =>
  BuilderTree.create(name)
);
type LoadTreeEvent = {
  type: "loadTree";
  tree: BuilderTree.TTree;
};

export const loadTree = assign((_: Context, { tree }: LoadTreeEvent) => tree);
type UpdateTreeEvent = {
  type: "updateTree";
  tree: DeepPartial<BuilderTree.TTree>;
};
export const updateTree = assign(
  (context: Context, { tree }: UpdateTreeEvent) => {
    return merge(context, tree);
  }
);

type SelectRelationEvent = { type: "selectRelation"; id: string };

export const selectRelation = immerAssign(
  (context: Context, { id }: SelectRelationEvent) => {
    context.selectedRelationId = id;
  }
);
