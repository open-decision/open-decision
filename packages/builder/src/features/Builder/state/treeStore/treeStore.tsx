import {
  BuilderEdge,
  BuilderNode,
  BuilderTree,
} from "@open-decision/type-classes";
import { groupBy, merge } from "remeda";
import { DeepPartial } from "utility-types";
import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export function createTreeStore(id: string) {
  const yDoc = new Y.Doc({ guid: id });
  const yMap = yDoc.getMap("tree");

  const nonSyncedStore = proxy({
    connectionSourceNodeId: "",
    validConnections: [] as string[],
    selection: { nodes: [], edges: [] } as { nodes: string[]; edges: string[] },
  });

  const syncedStore = proxy({
    startNode: "",
    nodes: [] as BuilderNode.TNodesRecord,
    edges: [] as BuilderEdge.TEdgeArray,
    name: "",
  });

  bindProxyAndYMap(syncedStore, yMap, {
    transactionOrigin: `valtio for ${id}`,
  });

  // ------------------------------------------------------------------
  // Tree
  function updateStartNode(startNode: string) {
    syncedStore.startNode = startNode;
  }

  function updateTreeName(name: string) {
    syncedStore.name = name;
  }

  // ------------------------------------------------------------------
  // Nodes

  function getNode(nodeId: string) {
    return syncedStore.nodes.find((node) => node.id === nodeId);
  }

  function addNode(node: Parameters<typeof BuilderNode.create>[0]) {
    const newNode = BuilderNode.create(node);

    syncedStore.nodes.push(newNode);
    if (!syncedStore.startNode) syncedStore.startNode = newNode.id;

    return newNode;
  }

  function updateNodeName(nodeId: string, name: string) {
    const node = getNode(nodeId);
    if (!node) return;

    node.data.name = name;
  }

  function updateNodePosition(
    nodeId: string,
    position: BuilderNode.TCoordinates
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.position.x = position.x;
    node.position.y = position.y;
  }

  function updateNodeContent(
    nodeId: string,
    content: BuilderNode.TNodeData["content"]
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.data.content = content;
  }

  function updateNodeRelations(
    nodeId: string,
    relations: BuilderNode.TNodeData["relations"]
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.data.relations = relations;
  }

  function deleteNodes(ids: string[]) {
    const nodes = syncedStore.nodes.filter((node) => !ids.includes(node.id));
    const edges = syncedStore.edges.filter(
      (edge) => !ids.includes(edge.source || edge.target)
    );

    syncedStore.nodes = nodes;
    syncedStore.edges = edges;
  }

  function addAssociatedNode(
    nodeId: string,
    newNodeData: Parameters<typeof BuilderNode.createNewAssociatedNode>[1],
    edgeId: string
  ) {
    const node = getNode(nodeId);

    const newNode = !node
      ? BuilderNode.create(newNodeData)
      : BuilderNode.createNewAssociatedNode(node, newNodeData);

    syncedStore.nodes.push(newNode);
    if (!syncedStore.startNode) syncedStore.startNode = newNode.id;

    edgeId
      ? updateEdgeTarget(edgeId, newNode.id)
      : addEdge({ source: nodeId, target: newNode.id });

    return newNode;
  }

  // ------------------------------------------------------------------
  // Edges

  function getEdge(edgeId: string) {
    return syncedStore.edges.find((edge) => edge.id === edgeId);
  }

  function addEdge(edge: Parameters<typeof BuilderEdge.create>[0]) {
    const newEdge = BuilderEdge.create(edge);

    getNode(newEdge.source)?.data.relations.push(newEdge.id);
    syncedStore.edges.push(newEdge);

    return newEdge;
  }

  function updateEdge(
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

  function deleteEdges(ids: string[]) {
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

  function updateEdgeTarget(edgeId: string, newTarget: string) {
    const edge = getEdge(edgeId);
    if (!edge) return;

    edge.target = newTarget;
  }

  function updateEdgeSource(edgeId: string, newSource: string) {
    const edge = getEdge(edgeId);
    if (!edge) return;

    edge.source = newSource;
  }

  function updateEdgeAnswer(edgeId: string, newAnswer: string) {
    const edge = getEdge(edgeId);
    if (!edge) return;

    edge.data.answer = newAnswer;
  }

  // ------------------------------------------------------------------
  // Selection

  function removeSelectedNodes(nodeIds?: string[]) {
    if (nodeIds)
      nonSyncedStore.selection.nodes.filter((nodeId) =>
        nodeIds.includes(nodeId)
      );
    return (nonSyncedStore.selection.nodes = []);
  }

  function addSelectedNodes(nodeIds: string[]) {
    nonSyncedStore.selection.nodes.push(...nodeIds);
  }

  function replaceSelectedNodes(nodeIds: string[]) {
    removeSelectedNodes();
    addSelectedNodes(nodeIds);
  }

  // ------------------------------------------------------------------
  // Connection

  function startConnecting(sourceNodeId: string) {
    const connectionOriginNode = getNode(sourceNodeId);
    if (!connectionOriginNode) return;

    nonSyncedStore.connectionSourceNodeId = sourceNodeId;

    const validConnections = BuilderTree.getConnectableNodes(
      connectionOriginNode.id
    )(syncedStore.nodes ?? []);

    nonSyncedStore.validConnections = validConnections;
  }

  function abortConnecting() {
    nonSyncedStore.connectionSourceNodeId = "";
    nonSyncedStore.validConnections = [];
  }

  function connect(target: string) {
    if (nonSyncedStore.connectionSourceNodeId == null) return;

    addEdge({ source: nonSyncedStore.connectionSourceNodeId, target });
  }

  return {
    yDoc,
    nonSyncedStore,
    syncedStore,
    connect,
    abortConnecting,
    startConnecting,
    addAssociatedNode,
    addEdge,
    addNode,
    addSelectedNodes,
    removeSelectedNodes,
    replaceSelectedNodes,
    updateEdge,
    updateEdgeAnswer,
    updateEdgeSource,
    updateEdgeTarget,
    deleteEdges,
    deleteNodes,
    updateNodeContent,
    updateNodeName,
    updateNodeRelations,
    updateNodePosition,
    updateStartNode,
    updateTreeName,
  };
}
