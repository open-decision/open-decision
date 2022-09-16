import { useNodes } from "@open-decision/tree-sync";
import { useEditor } from "./useEditor";

export function useRFNodes() {
  const nodes = useNodes();
  const { selectedNodeIds } = useEditor();

  if (!nodes) return [];

  return Object.values(nodes).map((node) => ({
    ...node,
    type: "customNode",
    selected: selectedNodeIds.includes(node.id),
  }));
}
