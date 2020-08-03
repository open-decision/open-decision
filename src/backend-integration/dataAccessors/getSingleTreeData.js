import { lensPath, view, map, compose, prop, lensProp, over } from "ramda";

export const getSingleTreeData = (data) => {
  const treeDataLens = lensPath(["data", "decisionTree", "nodeSet", "edges"]);
  const inputsLens = lensProp(["inputs"]);

  return compose(
    map(
      compose(
        over(inputsLens, JSON.parse),
        // compose(prop("string"), JSON.parse)),
        prop("node")
      )
    ),
    view(treeDataLens)
  )(data);
};
