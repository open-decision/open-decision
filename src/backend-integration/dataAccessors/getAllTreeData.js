import { map, pipe, pathOr } from "ramda";

export const getAllTreeData = (data) => {
  const allTreeData = pathOr([], ["allDecisionTrees", "edges"]);
  const parseTags = pipe(pathOr("", ["node", "tags"]), JSON.parse);

  return pipe(allTreeData, map(parseTags))(data);
};
