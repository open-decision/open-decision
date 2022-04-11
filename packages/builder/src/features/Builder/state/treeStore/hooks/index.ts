import * as React from "react";
import { Condition, Edge, Node } from "@open-decision/type-classes";
import { pick } from "remeda";
import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";
import { useNodes as useRFNodes } from "react-flow-renderer";

export function useSelectedNodes():
  | ["none", undefined]
  | ["single", Node.TNode]
  | ["multi", Record<string, Node.TNode>] {
  const rfNodes = useRFNodes();

  const selectedNodeIds = rfNodes
    .filter((node) => node.selected)
    .map((node) => node.id);

  const nodes = useNodes(selectedNodeIds);

  if (selectedNodeIds.length === 1)
    return ["single", nodes[selectedNodeIds[0]]];
  if (selectedNodeIds.length > 1) return ["multi", nodes];

  return ["none", undefined];
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
