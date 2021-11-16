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
  id: z.string().uuid(),
  treeName: z.string().min(1),
  nodes: Node.Record,
  startNode: z.string(),
});

// ------------------------------------------------------------------
// Methods

export const getParents =
  (id: string) =>
  (tree: PublicTree.TTree | BuilderTree.TTree): string[] =>
    pipe(
      tree.nodes,
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
    pipe(tree.nodes[node.id], (node) =>
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
    const nodesOnPaths = getPaths(tree.nodes[source])(tree).flatMap(
      (path) => path
    );

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };

export const getPaths =
  ({ id }: PublicNode.TNode | BuilderNode.TNode) =>
  (tree: PublicTree.TTree | BuilderTree.TTree) => {
    const adjacencyList = createAdjacencyList(tree.nodes);

    return depthFirstSearch(id, adjacencyList);
  };

export const getConnectableNodes =
  (node: PublicNode.TNode | BuilderNode.TNode) =>
  (tree: PublicTree.TTree | BuilderTree.TTree) => {
    const nodesOnPath = getPaths(node)(tree).flatMap((path) => path);

    return pipe(
      tree.nodes,
      values,
      filter(
        (iteratedNode) =>
          iteratedNode.id !== node.id && !nodesOnPath.includes(iteratedNode.id)
      )
    );
  };

export const getTreeHash = (
  tree: Omit<PublicTree.TTree, "checksum" | "startNode">
) => {
  //TODO: include startNode once its added to the type by uncommenting
  // const dataToHash = (({ id, startNode, nodes}) => ({ id, startNode, nodes }))(tree)
  const dataToHash = (({ id, nodes }) => ({ id, nodes }))(tree);
  // Use "json-stable-stringify" to get a deterministic JSON string
  // then hash using murmur3 as hash-algo, as it's lightweight and small, seed is 0
  return murmur.murmur3(stringify(dataToHash), 0);
};
