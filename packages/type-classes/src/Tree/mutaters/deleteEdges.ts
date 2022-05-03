import { Tree } from "../type-classes";

export const deleteEdges = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    delete tree.edges?.[id];
  });
};
