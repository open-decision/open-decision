import { TNodeId } from "@open-decision/tree-ids";
import { pipe, values, reduce, uniq } from "remeda";
import { Tree } from "../type-classes";

/**
 * Get the immediate parents of the node with the provided id.
 */
export const getParents = (tree: Tree.TTree) => (nodeId: TNodeId) => {
  if (!tree.edges) return [];

  return pipe(
    tree.edges,
    values,
    // Reduce the edges with the provided node id as a target to an array
    reduce((acc: string[], edge) => {
      if (edge.target === nodeId) return [...acc, edge.source];

      return acc;
    }, []),
    // Remove duplicates
    uniq()
  );
};
