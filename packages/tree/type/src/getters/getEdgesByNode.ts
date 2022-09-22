import { isEmpty } from "ramda";
import { Edge, Tree } from "../type-classes";

export const getEdgesByNode = (tree: Tree.TTree) => (nodeId: string) => {
  if (!tree.edges) return undefined;

  // We loop over the edges and check if the node is present on the edge.
  const relatedEdges: Record<"source" | "target", Edge.TRecord | undefined> = {
    source: undefined,
    target: undefined,
  };
  for (const key in tree.edges) {
    const edge = tree.edges[key];

    if (edge.source === nodeId) {
      if (!relatedEdges.source) relatedEdges.source = {};
      relatedEdges.source[key] = edge;
    }
    if (edge.target === nodeId) {
      if (!relatedEdges.target) relatedEdges.target = {};

      relatedEdges.target[key] = edge;
    }
  }

  // If the resulting conditions are empty we return undefined, because it is more meaningful and
  // easier to handle downstream.
  if (isEmpty(relatedEdges.source) && isEmpty(relatedEdges.target))
    return undefined;

  return relatedEdges;
};
