import { mapValues, omitBy, pick } from "remeda";
import { Tree } from "../type-classes";

const nodeWithName = (node: {
  id: string;
  name?: string;
}): node is { id: string; name: string } => {
  return typeof node.name === "string";
};

/**
 *  Gets the nodes of the provided ids with their name.
 * @param ids the ids of the nodes to get. If none are provided, all nodes are returned.
 * @param fallbackName used as the name if the node does not have one. If not provided a node without
 * a name will be omitted from the result.
 */
export const getNodeNames =
  (tree: Tree.TTree) => (ids?: string[], fallbackName?: string) => {
    if (!tree.nodes) return {};

    // map all the nodes into the desired shape. If the node does not have a name, use the fallback.
    const nodes = mapValues(tree.nodes, (node) => ({
      id: node.id,
      name: node.data.name ?? fallbackName,
    }));

    // Filter out all the nodes without a name.
    const nodesWithNames = omitBy(nodes, (node) =>
      nodeWithName(node)
    ) as Record<string, { id: string; name: string }>;

    // If no ids are provided, return all the nodes with names.
    return ids ? pick(nodesWithNames, ids) : nodesWithNames;
  };
