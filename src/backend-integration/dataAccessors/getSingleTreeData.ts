import { map, pathOr, propOr, pipe } from "ramda";

export const getSingleTreeData = (data: unknown) => {
  const treeData = pathOr([], ["decisionTree", "nodeSet", "edges"]);
  const parseInputs = pipe(propOr("", "inputs"), JSON.parse);

  return pipe(treeData, map(parseInputs))(data);
};
