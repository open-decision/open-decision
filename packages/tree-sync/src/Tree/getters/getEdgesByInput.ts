import { isEmpty } from "ramda";
import { Edge, Tree } from "../type-classes";
import { getCondition } from "./getCondition";

export const getEdgesByInput = (tree: Tree.TTree) => (inputId: string) => {
  if (!tree.edges) return undefined;

  // We loop over the edges and check if the node is present on the edge.
  const relatedEdges: Edge.TRecord = {};
  for (const key in tree.edges) {
    const edge = tree.edges[key];
    if (!edge.conditionId) break;

    const condition = getCondition(tree)(edge.conditionId);

    if (condition.inputId === inputId) relatedEdges[key] = edge;
  }

  // If the resulting edges are empty we return undefined, because it is more meaningful and
  // easier to handle downstream.
  if (isEmpty(relatedEdges)) return undefined;

  return relatedEdges;
};
