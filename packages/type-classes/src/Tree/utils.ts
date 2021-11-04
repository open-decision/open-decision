import { mapObjIndexed } from "ramda";

export function createAdjacencyList<
  T extends Record<string, { relations: Record<string, { target?: string }> }>
>(obj: T) {
  return mapObjIndexed((node, key) => {
    const list: Record<string, string[]> = {};
    const relations = node.relations;
    if (!list[key]) list[key] = [];

    Object.values(relations).forEach((relation) => {
      if (relation.target) {
        if (!list[relation.target]) {
          list[relation.target] = [];
        }

        list[relation.target].push(key);
      }
    });

    return list[1];
  }, obj);
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

    adjacencyList[id]?.forEach((target) => {
      if (!visited[target]) {
        return depthFirstSearch(target);
      }
    });

    if (path.length > 1) result.push(path);
    path = [startId];
  })(startId);

  return result;
}
