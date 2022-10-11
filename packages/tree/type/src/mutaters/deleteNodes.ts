import { Tree } from "../type-classes";

export const deleteNodes = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    delete tree.nodes?.[id];
  });
};
