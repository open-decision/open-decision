import { Tree } from "../type-classes";

export const getNode = (tree: Tree.TTree) => (nodeId: string) => {
  return tree.nodes?.[nodeId];
};
