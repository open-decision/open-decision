import { BuilderTree } from "@open-decision/type-classes";
import { useSnapshot } from "valtio";
import { treeStore } from "../treeStore";

export function useSelectedNode() {
  const {
    value: {
      selectedNodeId,
      treeData: { nodes },
    },
  } = useSnapshot(treeStore);

  if (!selectedNodeId) return undefined;

  return nodes[selectedNodeId];
}

export function useSelectedRelationId() {
  const {
    value: { selectedRelationId },
  } = useSnapshot(treeStore);

  return selectedRelationId;
}

export function useStartNode() {
  const {
    value: {
      treeData: { startNode },
    },
  } = useSnapshot(treeStore);

  return startNode;
}

export function useConnect() {
  const {
    value: { connectionSourceNode, validConnections },
  } = useSnapshot(treeStore);

  return { connectionSourceNode, validConnections };
}

export function useNodes(ids?: string[]) {
  const {
    value: {
      treeData: { nodes },
    },
  } = useSnapshot(treeStore);

  if (ids) return Object.fromEntries(ids.map((id) => [id, nodes[id]])) ?? {};

  return nodes ?? {};
}

export function useNode(id: string) {
  const {
    value: {
      treeData: {
        nodes: { [id]: node },
      },
    },
  } = useSnapshot(treeStore);

  if (!node) return undefined;
  return node;
}

export function useTree() {
  const {
    value: { name, treeData, id },
  } = useSnapshot(treeStore);

  return { name, treeData, id };
}

export function useParents(nodeId: string) {
  return BuilderTree.getParents(nodeId)(treeStore.value);
}

export function useStatus() {
  return treeStore.value.status;
}
