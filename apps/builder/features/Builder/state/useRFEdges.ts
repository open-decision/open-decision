import { getEdges, useTree } from "@open-decision/tree-sync";
import { MarkerType } from "react-flow-renderer";
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
  const edges = useTree((tree) => getEdges(tree)());
  const selectedEdgeIds = useSelectedEdgeIds();

  if (!edges) return [];

  return Object.values(edges).map((edge) => ({
    ...edge,
    selected: selectedEdgeIds.includes(edge.id),
    ...staticEdgeData,
  }));
}
