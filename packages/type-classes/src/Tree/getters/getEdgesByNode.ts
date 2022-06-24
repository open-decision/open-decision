import { Edge } from "../..";

export const getEdgesByNode =
  (edges: Edge.TEdgesRecord) => (nodeId: string) => {
    const nodesEdges: Edge.TEdgesRecord = {};

    if (edges) {
      for (const key in edges) {
        const edge = edges[key];

        if (edge.source === nodeId) nodesEdges[key] = edge;
      }
    }

    return nodesEdges;
  };
