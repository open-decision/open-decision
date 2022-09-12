import { Condition, Edge, Node } from "@open-decision/type-classes";
import { getInputs } from "packages/type-classes/src/Tree/getters";
import { MarkerType } from "react-flow-renderer";
import { pick } from "remeda";
import { useSnapshot } from "valtio";
import { useTreeClient, useTreeContext, useTreeData } from "../TreeContext";

export function useSelectedNodes():
  | ["none", undefined]
  | ["single", Node.TNode]
  | ["multi", Node.TNode[]] {
  const { tree } = useTreeContext();
  const {
    nonSyncedStore: { selectedNodeIds },
    syncedStore: { nodes },
  } = useSnapshot(tree);

  if (!nodes) return ["none", undefined];

  const selectedNodes = Object.values(pick(nodes, selectedNodeIds));

  if (selectedNodeIds.length === 1) return ["single", selectedNodes[0]];
  if (selectedNodeIds.length > 1) return ["multi", selectedNodes];

  return ["none", undefined];
}

export function useStartNodeId() {
  const { tree } = useTreeContext();

  const {
    syncedStore: { startNode },
  } = useSnapshot(tree);

  return startNode;
}

export function useRFNodes() {
  const { tree } = useTreeContext();

  const {
    nonSyncedStore: { selectedNodeIds },
    syncedStore: { nodes },
  } = useSnapshot(tree);

  if (!nodes) return [];

  return Object.values(nodes).map((node) => ({
    ...node,
    type: "customNode",
    selected: selectedNodeIds.includes(node.id),
  }));
}

const staticEdgeData = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#3352C5",
  },
  markerStart: {
    type: MarkerType.ArrowClosed,
    color: "#c1c8cd",
  },
};

export function useRFEdges() {
  const { tree } = useTreeContext();

  const {
    nonSyncedStore: { selectedEdgeIds },
    syncedStore: { edges },
  } = useSnapshot(tree);

  if (!edges) return [];

  return Object.values(edges).map((edge) => ({
    ...edge,
    selected: selectedEdgeIds.includes(edge.id),
    ...staticEdgeData,
  }));
}

export function useNodes(ids?: string[]): Node.TNodesRecord {
  const { tree } = useTreeContext();

  const {
    syncedStore: { nodes },
  } = useSnapshot(tree);

  if (!nodes) return {};
  if (ids) return pick(nodes, ids);
  return nodes;
}

export function useEdges(ids?: string[]) {
  const { tree } = useTreeContext();

  const {
    syncedStore: { edges },
  } = useSnapshot(tree);

  if (!edges) return {};
  if (ids) return pick(edges, ids);

  return edges;
}

export function useEdge(id: string) {
  const { tree } = useTreeContext();

  const {
    syncedStore: { edges },
  } = useSnapshot(tree);

  return edges?.[id];
}

export function useNode(id: string) {
  const { tree } = useTreeContext();

  const {
    syncedStore: { nodes },
  } = useSnapshot(tree);

  return nodes?.[id];
}

export function useInput(id: string) {
  const { tree } = useTreeContext();
  const {
    syncedStore: { inputs },
  } = useSnapshot(tree);

  return inputs?.[id];
}

export function useInputs(ids: string[]) {
  const treeData = useTreeData();

  return getInputs(treeData)(ids);
}

export function useEdgesOfNode(nodeId: string) {
  const { tree } = useTreeContext();
  const {
    syncedStore: { edges },
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

export function useConditionsOfNode(
  nodeId: string
): Condition.TRecord | undefined {
  const { tree } = useTreeContext();
  const {
    syncedStore: { conditions, nodes },
  } = useSnapshot(tree);
  const node = nodes?.[nodeId];

  if (conditions && node) {
    return pick(conditions, node.data.conditions);
  }

  return undefined;
}

export function useTree() {
  const { tree } = useTreeContext();

  return useSnapshot(tree);
}

export function useParents(nodeId: string): { id: string; name?: string }[] {
  const { derivedNodeNames } = useTreeContext();
  const treeClient = useTreeClient();
  const { nodeNames } = useSnapshot(derivedNodeNames);

  const parentIds = treeClient.nodes.get.parents(nodeId);

  return Object.values(nodeNames).filter((nodeName) =>
    parentIds.includes(nodeName.id)
  );
}
