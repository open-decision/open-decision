import { lensPath, view } from "ramda";

export const getTreeData = (data) => {
  const treeDataLens = lensPath(["data", "allDecisionTrees", "edges"]);
  return view(treeDataLens)(data);
};
