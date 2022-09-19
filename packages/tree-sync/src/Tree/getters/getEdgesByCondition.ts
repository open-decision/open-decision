import { isEmpty } from "ramda";
import { Edge, Tree } from "../type-classes";

export const getEdgesByCondition =
  (tree: Tree.TTree) => (conditionId: string) => {
    const conditionEdges: Edge.TEdgesRecord = {};

    if (tree.edges) {
      for (const key in tree.edges) {
        const edge = tree.edges[key];

        if (edge.conditionId && edge.conditionId === conditionId)
          conditionEdges[key] = edge;
      }
    }

    if (isEmpty(conditionEdges)) return undefined;

    return conditionEdges;
  };
