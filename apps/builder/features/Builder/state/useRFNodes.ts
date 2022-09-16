import { useNodes } from "@open-decision/tree-sync";
import { useSelectedNodeIds } from "./useSelectedNodes";

export function useRFNodes() {
  const nodes = useNodes();
  const selectedNodeIds = useSelectedNodeIds();

  if (!nodes) return [];

  return Object.values(nodes).map((node) => ({
    ...node,
    type: "customNode",
    selected: selectedNodeIds.includes(node.id),
  }));
}
