import { useEditor } from "./useEditor";
import { useTree } from "@open-decision/tree-sync";
import { useSnapshot } from "valtio";

export function useSelectedNodes() {
  const selectedNodeIds = useSelectedNodeIds();
  const nodes = useTree((treeClient) =>
    treeClient.nodes.get.collection(selectedNodeIds)
  );

  if (!nodes) return undefined;

  return nodes;
}

export function useSelectedNodeIds() {
  const { editorStore } = useEditor();
  const { selectedNodeIds } = useSnapshot(editorStore);

  return selectedNodeIds;
}
