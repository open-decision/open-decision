/**
 * Get a Record of all object keys with their targets in an array.
 * {@link https://en.wikipedia.org/wiki/Adjacency_list}
 */
export function createAdjacencyList<
  T extends {
    id: string;
    data: { relations: string[] };
  }[]
>(array: T) {
  const adjacencyList = {};

  array.forEach((sourceNode) => {
    // If there is no key for this sourceNode yet; add it with a value of an empty array.
    if (!adjacencyList[sourceNode.id]) adjacencyList[sourceNode.id] = [];

    Object.values(sourceNode.data.relations).forEach((targetNodeId) => {
      if (!targetNodeId) return;

      // If there is no key for this targetNodeId yet; add it with a value of an empty array.

      if (!adjacencyList[targetNodeId]) adjacencyList[targetNodeId] = [];

      // Push the sourceNodeId to the targets array.
      adjacencyList[targetNodeId].push(sourceNode.id);
    });
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
