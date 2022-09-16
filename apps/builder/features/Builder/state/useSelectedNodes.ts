import { useEditor } from "./useEditor";
import { pick } from "remeda";
import { useNodes } from "@open-decision/tree-sync";
import { useSnapshot } from "valtio";

export function useSelectedNodes() {
  const nodes = useNodes();
  const selectedNodeIds = useSelectedNodeIds();

  if (!nodes) return undefined;

  return Object.values(pick(nodes, selectedNodeIds));
}

export function useSelectedNodeIds() {
  const { editorStore } = useEditor();
  const { selectedNodeIds } = useSnapshot(editorStore);

  return selectedNodeIds;
}
