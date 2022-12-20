import { useSubscribedTreeClient } from "@open-decision/tree-sync";
import { MarkerType } from "reactflow";
import { useSelectedEdgeIds } from "./useSelectedEdges";

export function useRFEdges() {
  const subscribedTreeClient = useSubscribedTreeClient();

  const selectedEdgeIds = useSelectedEdgeIds();
  const edges = subscribedTreeClient.edges.get.all();

  if (!edges) return [];

  return Object.values(edges)
    .map((edge) => ({
      ...edge,
      selected: selectedEdgeIds.includes(edge.id),
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }))
    .filter((edge) => edge.target) as {
    type?: any;
    data?: unknown;
    target: string;
    id: string;
    source: string;
  }[];
}
