import { useEdges } from "@open-decision/tree-sync";
import { MarkerType } from "react-flow-renderer";
import { useEditor } from "./useEditor";

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
  const edges = useEdges();
  const { selectedEdgeIds } = useEditor();

  if (!edges) return [];

  return Object.values(edges).map((edge) => ({
    ...edge,
    selected: selectedEdgeIds.includes(edge.id),
    ...staticEdgeData,
  }));
}
