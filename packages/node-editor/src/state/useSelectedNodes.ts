import { useEditor } from "./useEditor";
import { useSubscribedTreeClient } from "@open-decision/tree-sync";
import { useSnapshot } from "valtio";

export function useSelectedNodes() {
  const selectedNodeIds = useSelectedNodeIds();

  const subscribedTreeClient = useSubscribedTreeClient();
  const nodes = Object.values(
    subscribedTreeClient.nodes.get.collection(selectedNodeIds) ?? {}
  );

  if (!nodes) return undefined;

  return nodes;
}

export function useSelectedNodeIds() {
  const { editorStore } = useEditor();
  const { selectedNodeIds } = useSnapshot(editorStore);

  return selectedNodeIds;
}
