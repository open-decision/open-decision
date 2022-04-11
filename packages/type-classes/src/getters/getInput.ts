import { Tree } from "../type-classes";

export const getInput = (tree: Tree.TTree) => (inputId: string) => {
  return tree.inputs?.[inputId];
};
