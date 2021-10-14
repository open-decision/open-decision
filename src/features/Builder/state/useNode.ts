import { useSelector } from "@xstate/react";
import { TNode } from "../types/Node";
import { useTreeService } from "./useTree";

export function useNode(ids: string): TNode {
  const service = useTreeService();
  const nodes = useSelector(service, (state) => {
    return state.context.nodes[ids];
  });

  return nodes;
}

export function useNodes(ids: string[]): TNode[] {
  const service = useTreeService();
  const nodes = useSelector(service, (state) => state.context.nodes);

  return ids.map((id) => nodes[id]);
}
