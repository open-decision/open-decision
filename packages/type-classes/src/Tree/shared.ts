import * as BuilderNode from "../Node/BuilderNode";
import * as PublicNode from "../Node/PublicNode";
import * as BuilderTree from "../Tree/BuilderTree";
import * as PublicTree from "../Tree/PublicTree";
import { pipe, flatMap, filter, map, reduce, uniq } from "remeda";
import { values } from "ramda";
import { createAdjacencyList, depthFirstSearch } from "./utils";
import stringify from "json-stable-stringify";
import * as murmur from "murmurhash-js";
import * as Node from "../Node/PublicNode";
import { z } from "zod";

// ------------------------------------------------------------------
// Types
export const BaseTree = z.object({
  id: z.number(),
  name: z.string().min(1),
  treeData: Node.Record,
  startNode: z.string().optional(),
});

// ------------------------------------------------------------------
// Methods

export const getParents =
  (id: string) =>
  (tree: PublicTree.TTree | BuilderTree.TTree): string[] =>
    pipe(
      tree.treeData,
      values,
      flatMap((node) =>
        pipe(
          node.relations,
          values,
          reduce((acc: string[], relation) => {
            if (relation.target != null && relation.target === id)
              return [...acc, node.id];

            return acc;
          }, [])
        )
      ),
      uniq()
    );

export const getChildren =
  (node: BuilderNode.TNode | PublicNode.TNode) =>
  (tree: BuilderTree.TTree | PublicTree.TTree) =>
    pipe(tree.treeData[node.id], (node) =>
      pipe(
        node.relations,
        values,
        filter((relation) => !!relation.target),
        map((relation) => relation.target)
      )
    );

export const circularConnection =
  (tree: PublicTree.TTree | BuilderTree.TTree) =>
  ({ source, target }: { source: string; target: string }): boolean => {
    const nodesOnPaths = getPaths(tree.treeData[source])(tree).flatMap(
      (path) => path
    );

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };

export const getPaths =
  ({ id }: PublicNode.TNode | BuilderNode.TNode) =>
  (tree: PublicTree.TTree | BuilderTree.TTree) => {
    const adjacencyList = createAdjacencyList(tree.treeData);

    return depthFirstSearch(id, adjacencyList);
  };

export const getConnectableNodes =
  <
    TNode extends PublicNode.TNode | BuilderNode.TNode,
    TTree extends PublicTree.TTree | BuilderTree.TTree
  >(
    node: TNode
  ) =>
  (tree: TTree): TNode[] | TNode[] => {
    const nodesOnPath = getPaths(node)(tree).flatMap((path) => path);
    const nodesChildren = getChildren(node)(tree);

    return pipe(
      tree.treeData,
      Object.values,
      filter(
        (iteratedNode) =>
          iteratedNode.id !== node.id &&
          !nodesOnPath.includes(iteratedNode.id) &&
          !nodesChildren.includes(iteratedNode.id)
      )
    );
  };

export const getTreeHash = (tree: Omit<PublicTree.TTree, "checksum">) => {
  const dataToHash = (({ id, startNode, treeData }) => ({
    id,
    startNode,
    treeData,
  }))(tree);
  // Use "json-stable-stringify" to get a deterministic JSON string
  // then hash using murmur3 as hash-algo, as it's lightweight and small, seed is 0
  return murmur.murmur3(stringify(dataToHash), 0);
};

type IsUniqueNode =
  | { name?: string; id: string }
  | { name: string; id?: string };

export const isUnique = (tree: BuilderTree.TTree, node: IsUniqueNode) => {
  const { treeData } = tree;

  return !Object.values(treeData).some(
    (existingNode) =>
      node?.id === existingNode.id || node?.name?.trim() === existingNode.name
  );
};
