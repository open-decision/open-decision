import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";
import { pick } from "remeda";
import { isEmpty } from "ramda";
import { getEdgesByNode } from "@open-decision/type-classes";

export function useEdge(id: string) {
  const { tree } = useTreeContext();

  const {
    tree: { edges },
  } = useSnapshot(tree);

  return edges?.[id];
}

export function useEdges(ids?: string[]) {
  const { tree } = useTreeContext();

  const {
    tree: { edges },
  } = useSnapshot(tree);

  if (!edges || isEmpty(edges) || isEmpty(ids)) return undefined;
  if (ids) return pick(edges, ids);

  return edges;
}

export function useEdgesOfNode(nodeId: string) {
  const { tree } = useTreeContext();
  const {
    tree: { edges },
  } = useSnapshot(tree);

  if (!edges) return undefined;

  return getEdgesByNode(edges)(nodeId);
}
