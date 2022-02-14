import { BuilderNode } from "@open-decision/type-classes";
import { useTree } from "./useTree";

export function useNode(id: string): BuilderNode.TNode | undefined {
  const [node] = useTree((state) => state.tree.treeData[id]);

  if (!node) return undefined;
  return node;
}

export function useNodes(ids: string[]): BuilderNode.TNode[] {
  const [nodes] = useTree((state) => state.tree.treeData);
  return ids.map((id) => nodes[id]);
}

export function useSelectedNode() {
  const [node] = useTree((state) =>
    state.tree.selectedNodeId
      ? state.tree.treeData[state.tree.selectedNodeId]
      : undefined
  );

  if (!node) return undefined;

  return node;
}
