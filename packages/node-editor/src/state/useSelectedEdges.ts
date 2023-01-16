import { useEditor } from "./useEditor";
import { useSnapshot } from "valtio";
import { useSubscribedTreeClient } from "@open-decision/tree-sync";

export function useSelectedEdges() {
  const selectedEdgeIds = useSelectedEdgeIds();
  const subscribedTreeClient = useSubscribedTreeClient();
  const edges = subscribedTreeClient.edges.get.collection(selectedEdgeIds);

  if (!edges) return undefined;

  return Object.values(edges);
}

export function useSelectedEdgeIds() {
  const { editorStore } = useEditor();
  const { selectedEdgeIds } = useSnapshot(editorStore);

  return selectedEdgeIds;
}
