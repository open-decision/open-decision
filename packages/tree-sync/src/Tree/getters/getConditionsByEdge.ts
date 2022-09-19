import { Tree } from "../type-classes";
import { getCondition } from "./getCondition";
import { getEdge } from "./getEdge";

/**
 * Provide an edge id and receive the conditions that are related to it.
 * Returns undefined if there are no conditions.
 */
export const getConditionsByEdge = (tree: Tree.TTree) => (edgeId: string) => {
  const edge = getEdge(tree)(edgeId);
  if (!edge.conditionId) return undefined;

  return getCondition(tree)(edge.conditionId);
};
