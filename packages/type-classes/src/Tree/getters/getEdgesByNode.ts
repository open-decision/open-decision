import { isEmpty } from "ramda";
import { Edge } from "../..";

export const getEdgesByNode =
  (edges?: Edge.TEdgesRecord) => (nodeId: string) => {
    const nodesEdges: Edge.TEdgesRecord = {};

    if (edges) {
      for (const key in edges) {
        const edge = edges[key];

        if (edge.source === nodeId) nodesEdges[key] = edge;
      }
    }

    if (isEmpty(nodesEdges)) return undefined;

    console.log(nodesEdges);
    return nodesEdges;
  };
