import { useSelector } from "@xstate/react";
import { useTree } from "./useTree";

export function useNode(id: string) {
  const service = useTree();
  const node = useSelector(
    service,
    (state) => state.context.tree.state.elements.nodes[id]
  );

  return node;
}
