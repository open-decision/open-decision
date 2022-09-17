import { isEmpty } from "ramda";
import { Edge } from "../..";

export const getEdgesByCondition =
  (edges: Edge.TEdgesRecord) => (conditionId: string) => {
    const conditionEdges: Edge.TEdgesRecord = {};

    if (edges) {
      for (const key in edges) {
        const edge = edges[key];

        if (edge.conditionId && edge.conditionId === conditionId)
          conditionEdges[key] = edge;
      }
    }

    if (isEmpty(conditionEdges)) return undefined;

    return conditionEdges;
  };
