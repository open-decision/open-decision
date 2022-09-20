import { Tree } from "../type-classes";
import { getInputByCondition } from "./getInputByCondition";
import { getNodesByInput } from "./getNodesByInput";

/**
 * Provide a condition id and receive the nodes that are related to it.
 * Returns undefined if there are no nodes.
 */
export const getNodesByCondition =
  (tree: Tree.TTree) => (conditionId: string) => {
    const input = getInputByCondition(tree)(conditionId);
    if (!input) return undefined;

    return getNodesByInput(tree)(input);
  };
