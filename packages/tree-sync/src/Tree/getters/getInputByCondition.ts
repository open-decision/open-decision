import { Tree } from "../type-classes";
import { getCondition } from "./getCondition";

/**
 * Provide a condition id and receive the inputs that are related to it.
 * Returns undefined if there are no inputs.
 */
export const getInputByCondition =
  (tree: Tree.TTree) => (conditionId: string) => {
    return getCondition(tree)(conditionId).inputId;
  };
