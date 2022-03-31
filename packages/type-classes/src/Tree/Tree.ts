import * as Tree from "../Tree/Tree";
import * as Edge from "../Edge/Edge";
import * as Node from "../Node/Node";
import { z } from "zod";
import { pipe, filter, map, reduce, uniq } from "remeda";
import { createAdjacencyList, depthFirstSearch } from "./utils";

export const Type = z.object({
  nodes: Node.Array,
  edges: Edge.Array,
  startNode: z.string(),
});

type Nodes = Tree.TTree["nodes"];
type Edges = Tree.TTree["edges"];

// ------------------------------------------------------------------
// Methods

/**
 * Get the immediate parents of the node with the provided id.
 */
export const getParents =
  (node: Node.TNode) =>
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
export const getChildren = (nodeId: string) => (edges: Edge.TEdgeArray) => {
  return pipe(
    edges,
    // Filter out relations without targets
    filter((edge) => edge.source === nodeId),
    // Return an array of the target ids
    map((edge) => edge.target)
  );
};

export const circularConnection =
  ({ source, target }: { source: string; target: string }) =>
  (edges: Edge.TEdgeArray): boolean => {
    const nodesOnPaths = getPaths(source)(edges).flatMap((path) => path);

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };

export const getPaths = (nodeId: string) => (edges: Edge.TEdgeArray) => {
  const adjacencyList = createAdjacencyList(edges);

  return depthFirstSearch(nodeId, adjacencyList);
};

export const getConnectableNodes =
  (nodeId: string) =>
  (edges: Edge.TEdgeArray): string[] => {
    const nodesOnPath = getPaths(nodeId)(edges).flatMap((path) => path);
    const nodesChildren = getChildren(nodeId)(edges);

    return pipe(
      edges,
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

export type TTree = z.infer<typeof Type>;
