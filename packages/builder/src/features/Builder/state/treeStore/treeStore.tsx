import {
  BuilderEdge,
  BuilderNode,
  BuilderTree,
} from "@open-decision/type-classes";
import { OnSelectionChangeParams } from "react-flow-renderer";
import { groupBy, merge } from "remeda";
import { DeepPartial } from "utility-types";
import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export const yDoc = new Y.Doc();
const yMap = yDoc.getMap("tree");

export const nonSyncedStore = proxy({
  connectionSourceNodeId: "",
  validConnections: [] as string[],
  selection: {} as OnSelectionChangeParams,
});

export const syncedStore = proxy({
  startNode: "",
  nodes: [] as BuilderNode.TNodesRecord,
  edges: [] as BuilderEdge.TEdgeArray,
  name: "",
});

bindProxyAndYMap(syncedStore, yMap, { transactionOrigin: `valtio` });

// ------------------------------------------------------------------
// Tree
export function updateStartNode(startNode: string) {
  syncedStore.startNode = startNode;
}

export function updateTreeName(name: string) {
  syncedStore.name = name;
}

// ------------------------------------------------------------------
// Nodes

export function getNode(nodeId: string) {
  return syncedStore.nodes.find((node) => node.id === nodeId);
}

export function addNode(node: Parameters<typeof BuilderNode.create>[0]) {
  const newNode = BuilderNode.create(node);

  syncedStore.nodes.push(newNode);
  if (!syncedStore.startNode) syncedStore.startNode = newNode.id;

  return newNode;
}

export function updateNodeName(nodeId: string, name: string) {
  const node = getNode(nodeId);
  if (!node) return;

  node.data.name = name;
}

export function updateNodePosition(
  nodeId: string,
  position: BuilderNode.TCoordinates
) {
  const node = getNode(nodeId);
  if (!node) return;

  node.position = position;
}

export function updateNodeContent(
  nodeId: string,
  content: BuilderNode.TNodeData["content"]
) {
  const node = getNode(nodeId);
  if (!node) return;

  node.data.content = content;
}

export function updateNodeRelations(
  nodeId: string,
  relations: BuilderNode.TNodeData["relations"]
) {
  const node = getNode(nodeId);
  if (!node) return;

  node.data.relations = relations;
}

export function deleteNodes(ids: string[]) {
  syncedStore.nodes.filter((node) => ids.includes(node.id));
  syncedStore.edges.filter((edge) => ids.includes(edge.source || edge.target));
}

export function addAssociatedNode(
  nodeId: string,
  newNodeData: Parameters<typeof BuilderNode.createNewAssociatedNode>[1],
  edgeId: string
) {
  const node = getNode(nodeId);
  if (!node) return;

  const newNode = BuilderNode.createNewAssociatedNode(node, newNodeData);

  addNode(newNode);
  edgeId
    ? updateEdgeTarget(edgeId, newNode.id)
    : addEdge({ source: nodeId, target: newNode.id });

  return newNode;
}

// ------------------------------------------------------------------
// Edges

export function getEdge(edgeId: string) {
  return syncedStore.edges.find((edge) => edge.id === edgeId);
}

export function addEdge(edge: Parameters<typeof BuilderEdge.create>[0]) {
  const newEdge = BuilderEdge.create(edge);

  getNode(newEdge.source)?.data.relations.push(newEdge.id);
  syncedStore.edges.push(newEdge);

  return newEdge;
}

export function updateEdge(
  edge: DeepPartial<BuilderEdge.TEdge> & { id: BuilderEdge.TEdge["id"] }
) {
  const existingEdgeIndex = syncedStore.edges.findIndex(
    (existingEdge) => existingEdge.id === edge.id
  );

  syncedStore.edges[existingEdgeIndex] = merge(
    syncedStore.edges[existingEdgeIndex],
    edge
  );
}

export function deleteEdges(ids: string[]) {
  const { toDelete, rest } = groupBy(syncedStore.edges, (edge) =>
    ids.includes(edge.id) ? "toDelete" : "rest"
  );

  syncedStore.edges = rest;

  toDelete.forEach((edge) => {
    const sourceNode = getNode(edge.source);
    const targetNode = getNode(edge.target);

    sourceNode?.data.relations.filter((relation) => relation !== edge.id);
    targetNode?.data.relations.filter((relation) => relation !== edge.id);
  });
}

export function updateEdgeTarget(edgeId: string, newTarget: string) {
  const edge = getEdge(edgeId);
  if (!edge) return;

  edge.target = newTarget;
}

export function updateEdgeSource(edgeId: string, newSource: string) {
  const edge = getEdge(edgeId);
  if (!edge) return;

  edge.source = newSource;
}

export function updateEdgeAnswer(edgeId: string, newAnswer: string) {
  const edge = getEdge(edgeId);
  if (!edge) return;

  edge.data.answer = newAnswer;
}

// ------------------------------------------------------------------
// Selection

// export function addSelectedNodes(nodeIds: string[]) {
//   nonSyncedStore.selection.nodes = [
//     ...nonSyncedStore.selection.nodes,
//     ...nodeIds,
//   ];
// }
// export function replaceSelectedNodes(nodeIds: string[]) {
//   nonSyncedStore.selection.nodes = nodeIds;
// }

// export function deselectNodes(nodeIds: string[]) {
//   nonSyncedStore.selection.nodes = nonSyncedStore.selection.nodes.filter(
//     (id) => !nodeIds.includes(id)
//   );
// }

// export function deselectAllNodes() {
//   nonSyncedStore.selection.nodes = [];
// }

// export function addSelectedEdges(edgeIds: string[]) {
//   nonSyncedStore.selection.edges = [
//     ...nonSyncedStore.selection.edges,
//     ...edgeIds,
//   ];
// }

// export function replaceSelectedEdges(edgeIds: string[]) {
//   nonSyncedStore.selection.edges = edgeIds;
// }

// export function deselectEdges(edgeIds: string[]) {
//   nonSyncedStore.selection.edges = nonSyncedStore.selection.edges.filter(
//     (id) => !edgeIds.includes(id)
//   );
// }

// export function deselectAllEdges() {
//   nonSyncedStore.selection.edges = [];
// }

// ------------------------------------------------------------------
// Connection

export function startConnecting(sourceNodeId: string) {
  const connectionOriginNode = getNode(sourceNodeId);
  if (!connectionOriginNode) return;

  nonSyncedStore.connectionSourceNodeId = sourceNodeId;

  const validConnections = BuilderTree.getConnectableNodes(
    connectionOriginNode.id
  )(syncedStore.nodes ?? []);

  nonSyncedStore.validConnections = validConnections;
}

export function abortConnecting() {
  nonSyncedStore.connectionSourceNodeId = "";
  nonSyncedStore.validConnections = [];
}

export function connect(target: string) {
  if (nonSyncedStore.connectionSourceNodeId == null) return;

  addEdge({ source: nonSyncedStore.connectionSourceNodeId, target });
}
