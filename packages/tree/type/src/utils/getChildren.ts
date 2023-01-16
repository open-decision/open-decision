import { pipe, values, filter, map } from "remeda";
import { TNodeId } from "../plugin";
import { Tree } from "../type-classes";

/**
 * Get the immediate Children of the node with the provided id.
 */
export const getChildren = (tree: Tree.TTree) => (nodeId: TNodeId) => {
  if (!tree.edges) return [];

  return pipe(
    tree.edges,
    values,
    // Filter out relations without targets
    filter((edge) => edge.source === nodeId),
    // Return an array of the target ids
    map((edge) => edge.target)
  );
};
