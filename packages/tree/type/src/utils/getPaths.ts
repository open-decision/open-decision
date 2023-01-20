import { TNodeId } from "@open-decision/tree-ids";
import { Tree } from "../type-classes";

export function createAdjacencyList<
  T extends {
    source: TNodeId;
    target?: TNodeId;
  }[]
>(array: T) {
  const adjacencyList: Record<TNodeId, TNodeId[]> = {};

  array.forEach(({ source, target }) => {
    if (!target) return;
    // If there is no key for this sourceNode yet; add it with a value of an empty array.
    if (!adjacencyList[source]) adjacencyList[source] = [];

    if (!adjacencyList[target]) adjacencyList[target] = [];

    // Push the sourceNodeId to the targets array.
    adjacencyList[target].push(source);
  });

  return adjacencyList;
}

export function depthFirstSearch(
  startId: TNodeId,
  adjacencyList: Record<TNodeId, TNodeId[]>
) {
  const result: TNodeId[][] = [];
  let path: TNodeId[] = [];
  const visited: Record<string, boolean> = {};

  (function depthFirstSearch(id: TNodeId) {
    visited[id] = true;
    path.push(id);

    adjacencyList[id]?.forEach((neighbors) => {
      if (!visited[neighbors]) {
        return depthFirstSearch(neighbors);
      }
    });

    if (path.length > 1) result.push(path);
    path = [startId];
  })(startId);

  return result;
}

export const getPaths = (tree: Tree.TTree) => (nodeId: TNodeId) => {
  const adjacencyList = createAdjacencyList(Object.values(tree.edges ?? {}));

  return depthFirstSearch(nodeId, adjacencyList);
};
