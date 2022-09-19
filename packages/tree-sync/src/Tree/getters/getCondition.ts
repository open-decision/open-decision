import { pick } from "remeda";
import { ValuesType } from "utility-types";
import { Tree } from "../type-classes";

export const getCondition =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (conditionId: string) => {
    return tree.conditions?.[conditionId] as ValuesType<
      NonNullable<TTree["conditions"]>
    >;
  };

export const getConditions =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (conditionIds: string[]): TTree["conditions"] | undefined => {
    if (!tree.conditions) return undefined;

    const conditions = pick(tree.conditions, conditionIds);
    if (!conditions) return undefined;

    return conditions;
  };
