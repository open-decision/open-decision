import { Tree } from "../type-classes";
import { getCondition } from "./getCondition";
import { getEdge } from "./getEdge";
import { getInput } from "./getInput";

/**
 * Provide an edge id and receive the inputs that are related to it.
 * Returns undefined if there are no inputs.
 */
export const getInputByEdge = (tree: Tree.TTree) => (edgeId: string) => {
  const edge = getEdge(tree)(edgeId);
  if (!edge.conditionId) return undefined;

  const inputId = getCondition(tree)(edge.conditionId).inputId;

  if (!inputId) return undefined;

  return getInput(tree)(inputId);
};
