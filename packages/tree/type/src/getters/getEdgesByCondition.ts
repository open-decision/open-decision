import { isEmpty } from "ramda";
import { Edge, Tree } from "../type-classes";

/**
 * Provide a condition id and receive the edges that are related to it.
 * Returns undefined if there are no conditions.
 */
export const getEdgesByCondition =
  (tree: Tree.TTree) => (conditionId: string) => {
    if (!tree.edges) return undefined;

    // We loop over the edges and check if the condition is present on the edge.
    const conditionEdges: Edge.TRecord = {};
    for (const key in tree.edges) {
      const edge = tree.edges[key];

      if (edge.conditionId && edge.conditionId === conditionId)
        conditionEdges[key] = edge;
    }

    // If the resulting conditions are empty we return undefined, because it is more meaningful and
    // easier to handle downstream.
    if (isEmpty(conditionEdges)) return undefined;

    return conditionEdges;
  };
