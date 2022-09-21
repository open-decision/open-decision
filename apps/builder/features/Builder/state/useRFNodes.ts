import { useTree } from "@open-decision/tree-sync";
import { getNodes } from "@open-decision/tree-type";
import { useSelectedNodeIds } from "./useSelectedNodes";

export function useRFNodes() {
  const nodes = useTree((tree) => getNodes(tree)());
  const selectedNodeIds = useSelectedNodeIds();

  if (!nodes) return [];

  return Object.values(nodes).map(
    ({ id, inputs, position, type, content, data, name }) => ({
      type,
      selected: selectedNodeIds.includes(id),
      id,
      position,
      data: {
        ...data,
        name,
        content,
        inputs,
      },
    })
  );
}
