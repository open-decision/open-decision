import { useTree } from "@open-decision/tree-sync";
import { getNodes } from "@open-decision/tree-type";
import { useSelectedNodeIds } from "./useSelectedNodes";

export function useRFNodes() {
  const nodes = useTree((tree) => getNodes(tree)());
  const selectedNodeIds = useSelectedNodeIds();

  if (!nodes) return [];

  return Object.values(nodes).map(
    ({ id, inputs, position, type, content, name }) => ({
      type,
      selected: selectedNodeIds.includes(id),
      id,
      position,
      data: {
        name,
        content,
        inputs,
      },
    })
  );
}

export type RFNode = ReturnType<typeof useRFNodes>[number];
