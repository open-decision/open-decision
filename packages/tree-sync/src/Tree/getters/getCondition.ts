import { ODProgrammerError } from "@open-decision/type-classes";
import { pick } from "remeda";
import { Tree } from "../type-classes";

/**
 * Returns a single condition from the tree.
 * @throws {ODProgrammerError} if the condition does not exist
 */
export const getCondition =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (conditionId: string) => {
    const condition = tree.conditions?.[conditionId];

    if (!condition)
      throw new ODProgrammerError({
        code: "ENTITY_NOT_FOUND",
        message: `The condition of id ${conditionId} could not be found. Please check that the id is correct.
        Is the passed id actually a valid condition id?`,
      });

    return condition;
  };

export const getConditions =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (conditionIds?: string[]) => {
    if (!tree.conditions) return undefined;

    const conditions = pick(tree.conditions, conditionIds);
    if (!conditions) return undefined;

    return conditions;
  };
