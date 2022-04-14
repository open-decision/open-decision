import { Tree } from "../type-classes";

export const getCondition = (tree: Tree.TTree) => (conditionId: string) => {
  return tree.conditions?.[conditionId];
};
