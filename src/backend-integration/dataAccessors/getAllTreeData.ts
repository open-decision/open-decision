import { pathOr, pipe, map } from "remeda";

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
  (data: { allDecisionTrees: { edges: treeObject[] } }): Record<
    string,
    treeObject
  >[];
}

export const getAllTreeData: allTreeData = (data) => {
  const parseTags = (data: treeObject) =>
    pipe(data, pathOr(["node", "tags"], ""), JSON.parse);

  return pipe(data, pathOr(["allDecisionTrees", "edges"], []), map(parseTags));
};
