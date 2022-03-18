import { BuilderNode, BuilderTree } from "@open-decision/type-classes";
import { useStore } from "react-flow-renderer";
import { mapToObj } from "remeda";
import { useSnapshot } from "valtio";
import { derive } from "valtio/utils";
import { nonSyncedStore, syncedStore } from "../treeStore";
import shallow from "zustand/shallow";

export function useSelectedNodes():
  | ["none", []]
  | ["multi", BuilderNode.TNode[]]
  | ["single", BuilderNode.TNode] {
  const selectedNodes = useStore(
    (state) =>
      Array.from(state.nodeInternals)
        .filter(([_, n]) => n.selected)
        .map(([_, n]) => n),
    shallow
  );

  const { nodes } = useSnapshot(syncedStore);

  if (selectedNodes) {
    const nodesObj = mapToObj(nodes, (node) => [node.id, node]);

    if (selectedNodes.length > 1)
      return ["multi", selectedNodes.map(({ id }) => nodesObj[id])];
    if (selectedNodes.length > 0)
      return ["single", nodesObj[selectedNodes[0].id]];
  }

  return ["none", []];
}

export function useIsSelected(id: string) {
  const selectedNodes = useStore(
    (state) =>
      Array.from(state.nodeInternals)
        .filter(([_, n]) => n.selected)
        .map(([_, n]) => n),
    shallow
  );

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
