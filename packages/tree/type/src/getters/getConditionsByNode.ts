import { pick } from "remeda";
import { isEmpty } from "ramda";
import { Tree } from "../type-classes";

/**
 * Provide a node id and receive the conditions that are related to it.
 * Returns undefined if there are no conditions.
 */
export const getConditionsByNode = (tree: Tree.TTree) => (nodeId: string) => {
  const node = tree.nodes?.[nodeId];

  if (tree.conditions && node) {
    const conditions = pick(tree.conditions, node.data.conditions);

    // Instead of returning an empty object, return undefined. This is more meaningful and
    // easier to handle downstream.
    if (isEmpty(conditions)) return undefined;
    return conditions;
  }

  return undefined;
};
