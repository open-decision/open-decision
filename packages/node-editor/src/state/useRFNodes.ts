import { useTree } from "@open-decision/tree-sync";
import { Node } from "@open-decision/tree-type";
import { useSelectedNodeIds } from "./useSelectedNodes";

export function useRFNodes<TNode extends Node.TNode>() {
  const selectedNodeIds = useSelectedNodeIds();
  const nodes = useTree((treeClient) =>
    treeClient.nodes.get.collection(selectedNodeIds)
  );

  if (!nodes) return [];

  return Object.values(nodes).map(({ id, data, position, type, name }) => ({
    type,
    selected: selectedNodeIds.includes(id),
    id,
    position,
    data: { data: data as TNode["data"], name },
  }));
}

export type NodePluginData<TNode extends Node.TNode> = ReturnType<
  typeof useRFNodes<TNode>
>[number]["data"];
