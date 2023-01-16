import { Tree } from "../type-classes";

export const getNodeAll = (tree: Tree.TTree) => () => {
  return tree.nodes;
};
