import { useTree } from "@open-decision/tree-sync";
import { useSelectedNodeIds } from "./useSelectedNodes";

export function useRFNodes() {
  const nodes = useTree((treeClient) => treeClient.nodes.get.all());
  const selectedNodeIds = useSelectedNodeIds();

  if (!nodes) return [];

  return Object.values(nodes).map(({ id, position, type, parent }) => {
    return {
      type,
      selected: selectedNodeIds.includes(id),
      id,
      position,
      expandParent: true,
      data: undefined,
      className: "focus-visible:outer-focus",
      ...(parent ? ({ parentNode: parent } as const) : undefined),
    };
  });
}

export type NodePluginProps = ReturnType<typeof useRFNodes>[number];
