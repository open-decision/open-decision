import * as BuilderNode from "../Node/BuilderNode";
import { z } from "zod";
import { BaseTree } from "./shared";
import {
  enablePatches,
  produceWithPatches,
  applyPatches as immerApplyPatches,
} from "immer";
import * as BuilderRelation from "../Relation/BuilderRelation";
import { circularConnection } from "./BuilderTree";
import { merge } from "remeda";
import { DeepPartial } from "utility-types";
enablePatches();

export const Type = BaseTree.extend({
  treeData: BuilderNode.Record,
  selectedNodeId: z.string().optional(),
  selectedRelationId: z.string().optional(),
});

export type TTree = z.infer<typeof Type>;

export const Patch = z.object({
  op: z.enum(["replace", "remove", "add"]),
  path: z.array(z.union([z.string(), z.number()])),
  value: z.any().optional(),
});

export const Patches = z.array(Patch);

export type TPatch = z.infer<typeof Patch>;
export type TPatches = z.infer<typeof Patches>;

export function create(name: string): TTree {
  const newTree = {
    treeData: {},
    name,
    startNode: "",
  } as TTree;

  return newTree;
}

export const applyPatches = (patches: TPatch[]) => (tree: TTree) =>
  immerApplyPatches(tree, patches);

// ------------------------------------------------------------------
// State updater functions

type StateUpdateReturn = readonly [TTree, TPatch[], TPatch[]];

export const addNode =
  (node: BuilderNode.TNode) =>
  (tree: TTree): StateUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      // Assign the node to the treeData object by its id.
      draft.treeData[node.id] = node;

      // If no startNode exists assign the new nodes id to the startNode.
      // This in effect makes it so, that the first Node automatically becomes the startNode.
      if (draft.startNode === "") draft.startNode = node.id;
    });

export const updateNode =
  (node: Partial<BuilderNode.TNode> & { id: BuilderNode.TNode["id"] }) =>
  (tree: TTree): StateUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      // Get the old state of the Node.
      const oldNode = draft.treeData[node.id];

      // Merge the old with the new state and assign that to the treeData with the id of the Node.
      draft.treeData[node.id] = {
        ...oldNode,
        ...node,
      };
    });

export const deleteNodes =
  (ids: string[]) =>
  (tree: TTree): StateUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      // We loop over all the provided ids to allow for multiple Nodes to be deleted at once.
      ids.forEach((id) => {
        delete draft.treeData[id];

        // If the deletedNode is currently selected remove that selection.
        if (id === draft.selectedNodeId) draft.selectedNodeId = "";

        // Remove the Node from all the targets of other Nodes.
        for (const nodeId in draft.treeData) {
          const node = draft.treeData[nodeId];

          for (const nodeRelation in node.relations) {
            const relation = node.relations[nodeRelation];

            if (relation.target === id) {
              delete relation.target;
            }
          }
        }
      });
    });

const isCircularRelation =
  (nodeId: string, relation: BuilderRelation.TRelation) =>
  (tree: TTree): boolean => {
    if (!relation?.target) return false;

    const isCircular = circularConnection(tree)({
      source: nodeId,
      target: relation.target,
    });

    if (isCircular) return true;

    return false;
  };

export const addRelation =
  (nodeId: string, relation: Omit<BuilderRelation.TRelation, "id">) =>
  (tree: TTree): StateUpdateReturn => {
    const newRelation = BuilderRelation.create(relation);

    // We produce the new context inside this function, because we need to validate that the
    // added relation is not circular before comitting this to the state.
    const [newTree, patches, inversePatches] = produceWithPatches(
      tree,
      (draft) => {
        draft.treeData[nodeId].relations[newRelation.id] = newRelation;
      }
    );

    if (isCircularRelation(nodeId, newRelation)(newTree))
      return [tree, [] as TPatch[], [] as TPatch[]];

    return [newTree, patches, inversePatches];
  };

export const updateRelation =
  (nodeId: string, relation: BuilderRelation.TRelation) =>
  (tree: TTree): StateUpdateReturn => {
    const [newTree, patches, inversePatches] = produceWithPatches(
      tree,
      (draft) => {
        const oldValue = draft.treeData[nodeId].relations[relation.id];

        draft.treeData[nodeId].relations[relation.id] = {
          ...oldValue,
          ...relation,
        };
      }
    );

    if (isCircularRelation(nodeId, relation)(newTree))
      return [tree, [] as TPatch[], [] as TPatch[]];

    return [newTree, patches, inversePatches];
  };

export const deleteRelations =
  (nodeId: string, relationIds: string[]) =>
  (tree: TTree): StateUpdateReturn =>
    produceWithPatches(tree, (draft) => {
      relationIds.forEach((relationId) => {
        delete draft.treeData[nodeId].relations[relationId];
      });
    });

export const updateTree = (newTree: DeepPartial<TTree>) => (oldTree: TTree) =>
  merge(oldTree, newTree);

export {
  circularConnection,
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
  isUnique,
} from "./shared";
