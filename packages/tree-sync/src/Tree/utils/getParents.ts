import { pipe, values, reduce, uniq } from "remeda";
import { Tree } from "../type-classes";

/**
 * Get the immediate parents of the node with the provided id.
 */
export const getParents = (tree: Tree.TTree) => (nodeId: string) =>
  pipe(
    tree.edges ?? {},
    values,
    reduce((acc: string[], edge) => {
      if (edge.target === nodeId) return [...acc, edge.source];

      return acc;
    }, []),
    uniq()
  );
