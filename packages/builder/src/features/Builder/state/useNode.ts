import { BuilderNode } from "@open-decision/type-classes";
import { usePartOfTree } from "./useTree";

export function useNode(id: string): BuilderNode.TNode {
  const [node] = usePartOfTree((state) => {
    return state.context.nodes[id];
  });

  return node;
}

export function useNodes(ids: string[]): BuilderNode.TNode[] {
  const [nodes] = usePartOfTree((state) => state.context.nodes);

  return ids.map((id) => nodes[id]);
}
