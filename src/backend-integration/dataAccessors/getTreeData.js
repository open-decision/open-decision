import { lensPath, view, map, compose, prop, lensProp, over } from "ramda";

export const getTreeData = (data) => {
  const treeDataLens = lensPath(["data", "allDecisionTrees", "edges"]);
  const tagLens = lensProp(["tags"]);

  return compose(
    map(
      compose(over(tagLens, compose(prop("string"), JSON.parse)), prop("node"))
    ),
    view(treeDataLens)
  )(data);
};
