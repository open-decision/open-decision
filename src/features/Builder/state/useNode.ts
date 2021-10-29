import { TNode } from "../types/Node";
import { usePartOfTree } from "./useTree";

export function useNode(id: string): TNode {
  const [node] = usePartOfTree((state) => {
    return state.context.nodes[id];
  });

  return node;
}

export function useNodes(ids: string[]): TNode[] {
  const [nodes] = usePartOfTree((state) => state.context.nodes);

  return ids.map((id) => nodes[id]);
}
