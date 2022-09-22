import { Tree } from "../type-classes";
import { getCondition } from "./getCondition";
import { getInput } from "./getInput";

/**
 * Provide a condition id and receive the inputs that are related to it.
 * Returns undefined if there are no inputs.
 */
export const getInputByCondition =
  (tree: Tree.TTree) => (conditionId: string) => {
    const condition = getCondition(tree)(conditionId);
    if (!condition.inputId) return undefined;

    return getInput(tree)(condition.inputId);
  };
