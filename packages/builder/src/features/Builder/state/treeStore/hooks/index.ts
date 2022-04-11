import { Node } from "@open-decision/type-classes";
import { useSnapshot } from "valtio";
import { derive } from "valtio/utils";
import { useTreeContext } from "../TreeContext";

export function useSelectedNodes():
  | ["none", []]
  | ["multi", Node.TNode[]]
  | ["single", Node.TNode[]] {
  const { nonSyncedStore, tree } = useTreeContext();

  const {
    selection: { nodes: selectedNodeIds },
  } = useSnapshot(nonSyncedStore);
  const { nodes } = useSnapshot(tree);

  if (selectedNodeIds.length > 0) {
    const selectedNodes =
      nodes?.filter((node) => selectedNodeIds.includes(node.id)) ?? [];

    if (selectedNodes.length > 1) return ["multi", selectedNodes];
    if (selectedNodes.length > 0) return ["single", selectedNodes];
  }

  return ["none", []];
}

export function useSelectedNodeIds():
  | ["none", []]
  | ["multi", string[]]
  | ["single", string[]] {
  const { nonSyncedStore } = useTreeContext();

  const {
    selection: { nodes: selectedNodeIds },
  } = useSnapshot(nonSyncedStore);

  if (selectedNodeIds.length > 0) {
    if (selectedNodeIds.length > 1) return ["multi", selectedNodeIds];
    return ["single", selectedNodeIds];
  }

  return ["none", []];
}

export function useIsPreviewable() {
  const { tree } = useTreeContext();

  const { startNode } = useSnapshot(tree);

  return Boolean(startNode);
}

export function useStartNode() {
  const { tree } = useTreeContext();

  const { startNode, nodes } = useSnapshot(tree);

  return startNode ? nodes?.[startNode] : undefined;
}

export function useNodes(ids?: string[]): Node.TNodesRecord {
  const { tree } = useTreeContext();

  const { nodes } = useSnapshot(tree);

  return React.useMemo(() => {
    if (!nodes) return {};
    if (ids) return pick(nodes, ids);
    return nodes;
  }, [ids, nodes]);
}

export function useEdges(ids?: string[]) {
  const { tree } = useTreeContext();

  const { edges } = useSnapshot(tree);

  if (!edges) return {};
  if (ids) return pick(edges, ids);

  return edges;
}

export function useEdge(id: string) {
  const { tree } = useTreeContext();

  const { edges } = useSnapshot(tree);

  return edges?.[id];
}

export function useNode(id: string) {
  const { tree } = useTreeContext();

  const { nodes } = useSnapshot(tree);

  return nodes?.[id];
}

export function useInput(id: string) {
  const { tree } = useTreeContext();
  const { inputs } = useSnapshot(tree);

  return inputs?.[id];
}

export function useInputs(ids: string[]) {
  const { tree } = useTreeContext();
  const { inputs } = useSnapshot(tree);

  if (!inputs) return {};
  if (ids) return pick(inputs, ids);

  return inputs;
}

export function useEdgesOfNode(nodeId: string) {
  const { tree } = useTreeContext();
  const { edges } = useSnapshot(tree);

  const nodesEdges: Edge.TEdgesRecord = {};

  if (edges) {
    for (const key in edges) {
      const edge = edges[key];

      if (edge.source === nodeId) nodesEdges[key] = edge;
    }
  }

  return nodesEdges;
}

export function useConditionsOfNode(
  nodeId: string
): Condition.TRecord | undefined {
  const { tree, getNode } = useTreeContext();
  const { conditions } = useSnapshot(tree);
  const node = getNode(nodeId);

  if (conditions && node) {
    return pick(conditions, node.data.conditions);
  }
}

export function useTree() {
  const { tree } = useTreeContext();

  return useSnapshot(tree);
}

export function useParents(nodeId: string) {
  const { getParents, nodeData } = useTreeContext();

  const parentIds = getParents(nodeId);

  return pick(nodeData, parentIds);
}
