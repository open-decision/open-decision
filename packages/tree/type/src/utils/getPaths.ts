import { Tree } from "../type-classes";

export function createAdjacencyList<
  T extends {
    source: string;
    target?: string;
  }[]
>(array: T) {
  const adjacencyList: Record<string, string[]> = {};

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
  startId: string,
  adjacencyList: Record<string, string[]>
) {
  const result: string[][] = [];
  let path: string[] = [];
  const visited: Record<string, boolean> = {};

  (function depthFirstSearch(id: string) {
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

export const getPaths = (tree: Tree.TTree) => (nodeId: string) => {
  const adjacencyList = createAdjacencyList(Object.values(tree.edges ?? {}));

  return depthFirstSearch(nodeId, adjacencyList);
};
