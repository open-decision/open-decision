import { lensPath, view, map, compose, prop } from "ramda";

export const getAllTreeData = (data) => {
  const treeDataLens = lensPath(["data", "allDecisionTrees", "edges"]);

  const parseTags = (data) => {
    if (data.tags) {
      data.tags = JSON.parse(data.tags);
    }
    return data;
  };

  return compose(
    map(compose(parseTags, prop("node"))),
    view(treeDataLens)
  )(data);
};
