import { BuilderTree } from "@open-decision/type-classes";
import { useSnapshot } from "valtio";
import { treeStore } from "../treeStore";

export function useSelectedNode() {
  const {
    metadata: { selectedNodeId },
    treeData: { nodes },
  } = useSnapshot(treeStore);

  if (!selectedNodeId || !nodes) return undefined;

  return nodes[selectedNodeId];
}

export function useSelectedRelationId() {
  const {
    metadata: { selectedRelationId },
  } = useSnapshot(treeStore);

  return selectedRelationId;
}

export function useStartNode() {
  const {
    treeData: { startNode },
  } = useSnapshot(treeStore);

  return startNode;
}

export function useConnect() {
  const {
    metadata: { connectionSourceNodeId, validConnections },
  } = useSnapshot(treeStore);

  return { connectionSourceNodeId, validConnections };
}

export function useNodes(ids?: string[]) {
  const {
    treeData: { nodes },
  } = useSnapshot(treeStore);

  if (ids && nodes)
    return Object.fromEntries(ids.map((id) => [id, nodes[id]])) ?? {};

  return nodes ?? {};
}

export function useNode(id: string) {
  const {
    treeData: { nodes },
  } = useSnapshot(treeStore);

  if (!nodes) return undefined;

  return nodes[id];
}

export function useTree() {
  const {
    metadata: { name, id },
    treeData,
  } = useSnapshot(treeStore);

  return { name, treeData, id };
}

export function useParents(nodeId: string) {
  return BuilderTree.getParents(nodeId)(treeStore.treeData.nodes);
}

export function useStatus() {
  return treeStore.metadata.status;
}
