import { pick } from "remeda";
import { Condition, Tree } from "../type-classes";

export const getCondition = (tree: Tree.TTree) => (conditionId: string) => {
  return tree.conditions?.[conditionId];
};

export const getConditions =
  (tree: Tree.TTree) =>
  (conditionIds: string[]): Condition.TRecord | undefined => {
    if (!tree.conditions) return undefined;

    const conditions = pick(tree.conditions, conditionIds);
    if (!conditions) return undefined;

    return conditions;
  };
