import { useTree } from "@open-decision/tree-sync";
import { MarkerType } from "reactflow";
import { useSelectedEdgeIds } from "./useSelectedEdges";

const staticEdgeData = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#3352C5",
  },
  markerStart: {
    type: MarkerType.ArrowClosed,
    color: "#c1c8cd",
  },
};

export function useRFEdges() {
  const selectedEdgeIds = useSelectedEdgeIds();
  const edges = useTree((treeClient) =>
    treeClient.edges.get.collection(selectedEdgeIds)
  );

  if (!edges) return [];

  return Object.values(edges).map((edge) => ({
    ...edge,
    selected: selectedEdgeIds.includes(edge.id),
    ...staticEdgeData,
  }));
}
