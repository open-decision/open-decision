import { BuilderNode } from "@open-decision/type-classes";
import { useTree } from "./useTree";

export function useNode(id: string): BuilderNode.TNode {
  const [node] = useTree((state) => state.nodes[id]);

  return node;
}

export function useNodes(ids: string[]): BuilderNode.TNode[] {
  const [nodes] = useTree((state) => state.nodes);
  return ids.map((id) => nodes[id]);
}
