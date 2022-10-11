import { useTree } from "@open-decision/tree-sync";
import { getNodes, Node } from "@open-decision/tree-type";
import { useSelectedNodeIds } from "./useSelectedNodes";

export function useRFNodes<TNode extends Node.TNode>() {
  const nodes = useTree((tree) => getNodes(tree)());
  const selectedNodeIds = useSelectedNodeIds();

  if (!nodes) return [];

  return Object.values(nodes).map(({ id, data, position, type, name }) => ({
    type,
    selected: selectedNodeIds.includes(id),
    id,
    position,
    name,
    data: data as TNode,
  }));
}

export type NodePluginData<TNode extends Node.TNode> = ReturnType<
  typeof useRFNodes<TNode>
>[number];
