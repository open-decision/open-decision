import { Node } from "@open-decision/type-classes";
import { MarkerType } from "react-flow-renderer";
import { pick } from "remeda";
import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";

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

export function useHasStartNode() {
  const { tree } = useTreeContext();

  const {
    syncedStore: { startNode },
  } = useSnapshot(tree);

  return Boolean(startNode);
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

export function useParents(nodeId: string): { id: string; name?: string }[] {
  const {
    treeClient: {
      nodes: {
        get: { parents },
      },
    },
    derivedNodeNames,
  } = useTreeContext();

  const { nodeNames } = useSnapshot(derivedNodeNames);

  const parentIds = parents(nodeId);

  return Object.values(nodeNames).filter((nodeName) =>
    parentIds.includes(nodeName.id)
  );
}
