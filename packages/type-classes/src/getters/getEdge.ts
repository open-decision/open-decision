import { Tree } from "../type-classes";

export const getEdge = (tree: Tree.TTree) => (edgeId: string) => {
  return tree.edges?.[edgeId];
};
