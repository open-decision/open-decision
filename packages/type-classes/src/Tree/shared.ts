import * as BuilderNode from "../Node/BuilderNode";
import * as BuilderTree from "../Tree/BuilderTree";
import * as PublicTree from "../Tree/PublicTree";
import { pipe, flatMap, filter, map, reduce, uniq } from "remeda";
import { createAdjacencyList, depthFirstSearch } from "./utils";
import stringify from "json-stable-stringify";
import * as murmur from "murmurhash-js";

type Nodes =
  // | PublicTree.TTree["treeData"]["nodes"]
  BuilderTree.TTree["treeData"]["nodes"];

type Edges = BuilderTree.TTree["treeData"]["edges"];

// ------------------------------------------------------------------
// Methods
/**
 * Get the immediate parents of the node with the provided id.
 */
export const getParents =
  (node: BuilderNode.TNode) =>
  (edges: Edges): string[] =>
    pipe(
      edges,
      reduce((acc: string[], edge) => {
        if (edge.target === node.id) return [...acc, edge.source];

        return acc;
      }, []),
      uniq()
    );

/**
 * Get the immediate Children of the node with the provided id.
 */
export const getChildren = (nodeId: string) => (nodes: Nodes) => {
  const node = getNode(nodeId)(nodes);

  if (!node) return [] as string[];

  return pipe(
    node.data.relations,
    // Filter out relations without targets
    filter((relation) => Boolean(relation)),
    // Return an array of the target ids
    map((relation) => relation)
  );
};

export const circularConnection =
  ({ source, target }: { source: string; target: string }) =>
  (nodes: Nodes): boolean => {
    const nodesOnPaths = getPaths(source)(nodes).flatMap((path) => path);

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };

export const getPaths = (nodeId: string) => (nodes: Nodes) => {
  const adjacencyList = createAdjacencyList(nodes);

  return depthFirstSearch(nodeId, adjacencyList);
};

export const getConnectableNodes =
  (nodeId: string) =>
  (nodes: Nodes): string[] => {
    const nodesOnPath = getPaths(nodeId)(nodes).flatMap((path) => path);
    const nodesChildren = getChildren(nodeId)(nodes);

    return pipe(
      nodes,
      Object.values,
      filter(
        (iteratedNode) =>
          iteratedNode.id !== nodeId &&
          !nodesOnPath.includes(iteratedNode.id) &&
          !nodesChildren.includes(iteratedNode.id)
      ),
      map((node) => node.id)
    );
  };

export const getTreeHash = (tree: Omit<PublicTree.TTree, "checksum">) => {
  // Use "json-stable-stringify" to get a deterministic JSON string
  // then hash using murmur3 as hash-algo, as it's lightweight and small, seed is 0
  return murmur.murmur3(stringify({ id: tree.id, treeData: tree.treeData }), 0);
};

type IsUniqueNode =
  | { name?: string; id: string }
  | { name: string; id?: string };

export const isUnique = (node: IsUniqueNode) => (nodes: Nodes) => {
  return !Object.values(nodes).some(
    (existingNode) =>
      node?.id === existingNode.id ||
      node?.name?.trim() === existingNode.data.name
  );
};

export const getNode = (nodeId: string) => (nodes: Nodes) => {
  return nodes.find((node) => node.id === nodeId);
};
