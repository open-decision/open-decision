import { BuilderNode } from "@open-decision/type-classes";
import { useTree } from "./useTree";

export function useNode(id: string): BuilderNode.TNode | undefined {
  const [node] = useTree((state) => state.nodes[id]);

  if (!node) return undefined;
  return node;
}

export function useNodes(ids: string[]): BuilderNode.TNode[] {
  const [nodes] = useTree((state) => state.nodes);
  return ids.map((id) => nodes[id]);
}

export function useSelectedNode() {
  const [node] = useTree((state) =>
    state.selectedNodeId ? state.nodes[state.selectedNodeId] : undefined
  );

  if (!node) return undefined;

  return node;
}
