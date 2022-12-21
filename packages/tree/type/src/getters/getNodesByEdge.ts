import { Tree } from "../type-classes";
import { getNode } from "./getNode";
import { getEdge } from "./getEdge";

/**
 * Provide an edge id and receive the nodes that are related to it.
 * Returns undefined if there are no nodes.
 */
export const getNodesByEdge = (tree: Tree.TTree) => (edgeId: string) => {
  const edge = getEdge(tree)(edgeId);
  if (edge instanceof Error) return undefined;

  const source = getNode(tree)(edge.source);
  const target = edge?.target ? getNode(tree)(edge.target) : undefined;

  return { source, target };
};
