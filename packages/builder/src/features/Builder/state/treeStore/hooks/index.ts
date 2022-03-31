import { Node, Tree } from "@open-decision/type-classes";
import { useSnapshot } from "valtio";
import { derive } from "valtio/utils";
import { useTreeContext } from "../TreeContext";

export function useSelectedNodes():
  | ["none", []]
  | ["multi", Node.TNode[]]
  | ["single", Node.TNode[]] {
  const { nonSyncedStore, syncedStore } = useTreeContext();

  const {
    selection: { nodes: selectedNodeIds },
  } = useSnapshot(nonSyncedStore);
  const { nodes } = useSnapshot(syncedStore);

  if (selectedNodeIds.length > 0) {
    const selectedNodes = nodes.filter((node) =>
      selectedNodeIds.includes(node.id)
    );

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

export function useIsSelected(id: string) {
  const { syncedStore } = useTreeContext();

  const { nodes } = useSnapshot(syncedStore);
  const selectedNodes = nodes.filter((node) => node.selected);

  return selectedNodes.some((selectedNode) => selectedNode.id === id);
}

export function useIsPreviewable() {
  const { syncedStore } = useTreeContext();

  const { startNode } = useSnapshot(syncedStore);

  return Boolean(startNode);
}

export function useStartNode() {
  const { syncedStore } = useTreeContext();

  const { startNode, nodes } = useSnapshot(syncedStore);

  return nodes.find((node) => node.id === startNode);
}

export function useConnect() {
  const { nonSyncedStore } = useTreeContext();

  const { connectionSourceNodeId, validConnections } =
    useSnapshot(nonSyncedStore);

  return { connectionSourceNodeId, validConnections };
}

export function useNodes(ids?: string[]): Node.TNodesArray {
  const { syncedStore } = useTreeContext();

  const { nodes } = useSnapshot(syncedStore);

  if (ids && nodes) return nodes.filter((node) => ids.includes(node.id));

  return nodes;
}

export function useEdges(ids?: string[]) {
  const { syncedStore } = useTreeContext();

  const { edges } = useSnapshot(syncedStore);

  if (ids && edges) return edges.filter((node) => ids.includes(node.id));

  return edges;
}

export function useEdge(id: string) {
  const { syncedStore } = useTreeContext();

  const { edges } = useSnapshot(syncedStore);

  return edges.find((edge) => edge.id === id);
}

export function useNodeNames() {
  const { syncedStore } = useTreeContext();

  const { nodeNames } = derive({
    nodeNames: (get) => get(syncedStore).nodes.map((node) => node.data.name),
  });

  return nodeNames;
}

export function useNode(id: string) {
  const { syncedStore } = useTreeContext();

  const { nodes } = useSnapshot(syncedStore);

  return nodes.find((node) => node.id === id);
}

export function useTreeData() {
  const { syncedStore } = useTreeContext();

  return useSnapshot(syncedStore);
}

export function useParents(node: Node.TNode) {
  const { syncedStore } = useTreeContext();

  return Tree.getParents(node)(syncedStore.edges ?? []);
}
