import { BuilderNode, BuilderTree } from "@open-decision/type-classes";
import { pickBy } from "ramda";
import { useTree } from "../TreeProvider";
import { useSnapshot } from "valtio";

export function useSelectedNode() {
  const { nonSyncedStore } = useTree();

  const { selectedNodeId } = useSnapshot(nonSyncedStore);

  return useNode(selectedNodeId ?? "");
}

export function useIsPreviewable() {
  const { syncedStore } = useTree();

  const { nodes, startNode } = useSnapshot(syncedStore);

  return Object.values(nodes ?? {}).length > 0 && startNode;
}

export function useSelectedRelationId() {
  const { nonSyncedStore } = useTree();

  const { selectedRelationId } = useSnapshot(nonSyncedStore);

  return selectedRelationId;
}

export function useStartNode() {
  const { syncedStore } = useTree();

  const { startNode } = useSnapshot(syncedStore);

  return startNode;
}

export function useConnect() {
  const { nonSyncedStore } = useTree();

  const { connectionSourceNodeId, validConnections } =
    useSnapshot(nonSyncedStore);

  return { connectionSourceNodeId, validConnections };
}

export function useNodes(ids?: string[]): BuilderNode.TNodesRecord {
  const { syncedStore } = useTree();

  const { nodes } = useSnapshot(syncedStore);

  if (ids && nodes) return pickBy((node) => ids.includes(node.id))(nodes);

  return nodes;
}

export function useNode(id: string) {
  const { syncedStore } = useTree();

  const { nodes } = useSnapshot(syncedStore);

  if (!nodes) return undefined;

  return nodes[id] ?? undefined;
}

export function useTreeData() {
  const { syncedStore } = useTree();

  const { ...treeData } = useSnapshot(syncedStore);

  return { treeData };
}

export function useParents(nodeId: string) {
  const { syncedStore } = useTree();

  return BuilderTree.getParents(nodeId)(syncedStore.nodes ?? {});
}
