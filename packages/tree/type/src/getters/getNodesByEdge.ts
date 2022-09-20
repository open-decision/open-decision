import { Tree } from "../type-classes";
import { getNode } from "./getNode";
import { getEdge } from "./getEdge";

/**
 * Provide an edge id and receive the nodes that are related to it.
 * Returns undefined if there are no nodes.
 */
export const getNodesByEdge = (tree: Tree.TTree) => (edgeId: string) => {
  const edge = getEdge(tree)(edgeId);
  const source = getNode(tree)(edge.source);
  const target = getNode(tree)(edge.target);

  return { source, target };
};
