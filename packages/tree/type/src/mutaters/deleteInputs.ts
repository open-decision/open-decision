import { Tree } from "../type-classes";

export const deleteInputs = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    delete tree.inputs?.[id];
  });
};
