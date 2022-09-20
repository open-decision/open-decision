import { isEmpty } from "ramda";
import { Condition, Tree } from "../type-classes";
import { getConditions } from "./getCondition";

/**
 * Provide an input id and receive the conditions that are related to it.
 * Returns undefined if there are no conditions.
 */
export const getConditionsByInput = (tree: Tree.TTree) => (inputId: string) => {
  const conditions = getConditions(tree)();

  if (!conditions) return undefined;

  // We loop over the conditions and check if the input is present on the condition.
  const relatedConditions: Condition.TRecord = {};
  for (const key in tree.conditions) {
    const condition = tree.conditions[key];

    if (condition.inputId === inputId) relatedConditions[key] = condition;
  }

  // If the resulting conditions are empty we return undefined, because it is more meaningful and
  // easier to handle downstream.
  if (isEmpty(relatedConditions)) return undefined;

  return relatedConditions;
};
