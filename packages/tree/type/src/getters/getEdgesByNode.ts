import { isEmpty } from "ramda";
import { Edge, Tree } from "../type-classes";

export const getEdgesByNode = (tree: Tree.TTree) => (nodeId: string) => {
  if (!tree.edges) return undefined;

  // We loop over the edges and check if the node is present on the edge.
  const relatedEdges: Edge.TRecord = {};
  for (const key in tree.edges) {
    const edge = tree.edges[key];

    if (edge.source === nodeId) relatedEdges[key] = edge;
  }

  // If the resulting conditions are empty we return undefined, because it is more meaningful and
  // easier to handle downstream.
  if (isEmpty(relatedEdges)) return undefined;

  return relatedEdges;
};
