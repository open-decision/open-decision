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

  return nodes?.find((node) => node.id === startNode);
}

export function useConnect() {
  const { nonSyncedStore } = useTreeContext();

  const { connectionSourceNodeId, validConnections } =
    useSnapshot(nonSyncedStore);

  return { connectionSourceNodeId, validConnections };
}

export function useNodes(ids?: string[]): Node.TNodesArray {
  const { tree } = useTreeContext();

  const { nodes } = useSnapshot(tree);

  if (ids && nodes) return nodes.filter((node) => ids.includes(node.id));

  return nodes ?? [];
}

export function useEdges(ids?: string[]) {
  const { tree } = useTreeContext();

  const { edges } = useSnapshot(tree);

  if (ids && edges) return edges.filter((node) => ids.includes(node.id));

  return edges;
}

export function useEdge(id: string) {
  const { tree } = useTreeContext();

  const { edges } = useSnapshot(tree);

  return edges?.find((edge) => edge.id === id);
}

export function useNodeNames() {
  const { tree } = useTreeContext();

  const { nodeNames } = derive({
    nodeNames: (get) => get(tree).nodes?.map((node) => node.data.name),
  });

  return nodeNames;
}

export function useNode(id: string) {
  const { tree } = useTreeContext();

  const { nodes } = useSnapshot(tree);

  return nodes?.find((node) => node.id === id);
}

export function useTreeData() {
  const { tree } = useTreeContext();

  return useSnapshot(tree);
}

export function useParents(node: Node.TNode) {
  const { getParents } = useTreeContext();

  return getParents(node);
}
