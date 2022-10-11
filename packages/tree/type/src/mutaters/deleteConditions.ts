import { Tree } from "../type-classes";

export const deleteConditions = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    delete tree.conditions?.[id];
  });
};
