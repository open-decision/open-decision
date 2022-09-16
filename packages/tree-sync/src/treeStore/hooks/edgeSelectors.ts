import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";
import { pick } from "remeda";
import { Edge } from "@open-decision/type-classes";

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

  if (!edges) return {};
  if (ids) return pick(edges, ids);

  return edges;
}

export function useEdgesOfNode(nodeId: string) {
  const { tree } = useTreeContext();
  const {
    tree: { edges },
  } = useSnapshot(tree);

  const nodesEdges: Edge.TEdgesRecord = {};

  if (edges) {
    for (const key in edges) {
      const edge = edges[key];

      if (edge.source === nodeId) nodesEdges[key] = edge;
    }
  }

  return nodesEdges;
}
