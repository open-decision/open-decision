import { Tree } from "../type-classes";

export const getEdgeAll = (tree: Tree.TTree) => () => {
  return tree.edges;
};
