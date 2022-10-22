import { useEditor } from "./useEditor";
import { useSnapshot } from "valtio";
import { useTree } from "@open-decision/tree-sync";

export function useSelectedEdges() {
  const selectedEdgeIds = useSelectedEdgeIds();
  const edges = useTree((treeClient) =>
    Object.values(treeClient.edges.get.collection(selectedEdgeIds) ?? {})
  );

  if (!edges) return undefined;

  return edges;
}

export function useSelectedEdgeIds() {
  const { editorStore } = useEditor();
  const { selectedNodeIds } = useSnapshot(editorStore);

  return selectedNodeIds;
}
