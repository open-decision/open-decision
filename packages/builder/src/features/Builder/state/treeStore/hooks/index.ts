import { BuilderNode, BuilderTree } from "@open-decision/type-classes";
import { useSnapshot } from "valtio";
import { derive } from "valtio/utils";
import { nonSyncedStore, syncedStore } from "../treeStore";

export function useSelectedNodes():
  | ["none", []]
  | ["multi", BuilderNode.TNode[]]
  | ["single", BuilderNode.TNode[]] {
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

export function useIsSelected(id: string) {
  const { nodes } = useSnapshot(syncedStore);
  const selectedNodes = nodes.filter((node) => node.selected);

  return selectedNodes.some((selectedNode) => selectedNode.id === id);
}

export function useIsPreviewable() {
  const { startNode } = useSnapshot(syncedStore);

  return Boolean(startNode);
}

export function useStartNode() {
  const { startNode } = useSnapshot(syncedStore);

  return startNode;
}

export function useConnect() {
  const { connectionSourceNodeId, validConnections } =
    useSnapshot(nonSyncedStore);

  return { connectionSourceNodeId, validConnections };
}

export function useNodes(ids?: string[]) {
  const { nodes } = useSnapshot(syncedStore);

  if (ids && nodes) return nodes.filter((node) => ids.includes(node.id));

  return nodes;
}

export function useEdges(ids?: string[]) {
  const { edges } = useSnapshot(syncedStore);

  if (ids && edges) return edges.filter((node) => ids.includes(node.id));

  return edges;
}

export function useNodeNames() {
  const { nodeNames } = derive({
    nodeNames: (get) => get(syncedStore).nodes.map((node) => node.data.name),
  });

  return nodeNames;
}

export function useNode(id: string) {
  const { nodes } = useSnapshot(syncedStore);

  return nodes.find((node) => node.id === id);
}

export function useTreeData() {
  return useSnapshot(syncedStore);
}

export function useParents(node: BuilderNode.TNode) {
  return BuilderTree.getParents(node)(syncedStore.edges ?? []);
}
