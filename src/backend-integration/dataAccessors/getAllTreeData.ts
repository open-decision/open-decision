import { map, pipe, pathOr } from "ramda";

interface treeObject {
  node: {
    id: string;
    name: string;
    slug: string;
    tags?: [];
    createdAt: string;
  };
}

interface allTreeData {
  (allDecisionTrees: { edges: treeObject[] }): Record<string, treeObject>[];
}

export const getAllTreeData: allTreeData = (data) => {
  const allTreeData = pathOr([], ["allDecisionTrees", "edges"]);
  const parseTags = pipe(pathOr("", ["node", "tags"]), JSON.parse);

  return pipe(allTreeData, map(parseTags))(data);
};
