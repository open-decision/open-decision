import { Tree } from "../type-classes";

export const getTree = (tree: Tree.TTree) => () => {
  return tree;
};
