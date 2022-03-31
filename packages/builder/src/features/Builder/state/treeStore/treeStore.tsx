import { Edge, Node, Relation, Tree } from "@open-decision/type-classes";
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
    startNode: undefined as string | undefined,
    nodes: [] as Node.TNodesArray,
    edges: [] as Edge.TEdgeArray,
  });

  bindProxyAndYMap(syncedStore, yMap, {
    transactionOrigin: `valtio for ${id}`,
  });

  // ------------------------------------------------------------------
  // Tree
  function updateStartNode(startNode: string) {
    syncedStore.startNode = startNode;
  }

  // ------------------------------------------------------------------
  // Nodes

  function getNode(nodeId: string) {
    return syncedStore.nodes.find((node) => node.id === nodeId);
  }

  function getRelation(nodeId: string, relationId: string) {
    return getNode(nodeId)?.data.relations.find(
      (relation) => relation.id === relationId
    );
  }

  function addNode(node: Parameters<typeof Node.create>[0]) {
    const newNode = Node.create(node);

    syncedStore.nodes.push(newNode);
    if (!syncedStore.startNode) syncedStore.startNode = newNode.id;

    return newNode;
  }

  function updateNodeName(nodeId: string, name: string) {
    const node = getNode(nodeId);
    if (!node) return;

    node.data.name = name;
  }

  function updateNodePosition(nodeId: string, position: Node.TCoordinates) {
    const node = getNode(nodeId);
    if (!node) return;

    node.position.x = position.x;
    node.position.y = position.y;
  }

  function updateNodeContent(
    nodeId: string,
    content: Node.TNodeData["content"]
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.data.content = content;
  }

  function updateNodeRelations(
    nodeId: string,
    relations: Node.TNodeData["relations"]
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
    newNodeData: Parameters<typeof Node.createNewAssociatedNode>[1],
    edgeId: string
  ) {
    const node = getNode(nodeId);

    const newNode = !node
      ? Node.create(newNodeData)
      : Node.createNewAssociatedNode(node, newNodeData);

    syncedStore.nodes.push(newNode);
    if (!syncedStore.startNode) syncedStore.startNode = newNode.id;

    edgeId
      ? updateEdgeTarget(edgeId, newNode.id)
      : addEdge({ source: nodeId, target: newNode.id, type: "default" });

    return newNode;
  }

  // ------------------------------------------------------------------
  // Relations

  function addRelation(nodeId: string) {
    const newRelation = Relation.create();

    getNode(nodeId)?.data.relations.push(newRelation);
    return newRelation;
  }

  // ------------------------------------------------------------------
  // Edges

  function getEdge(edgeId: string) {
    return syncedStore.edges.find((edge) => edge.id === edgeId);
  }

  function addEdge(
    edge: Parameters<typeof Edge.create>[0],
    relationId?: string
  ) {
    const newEdge = Edge.create(edge);
    syncedStore.edges.push(newEdge);

    if (!relationId) {
      const newRelation = addRelation(edge.source);
      getRelation(newEdge.source, newRelation.id)?.edges.push(newEdge.id);
    } else {
      getRelation(newEdge.source, relationId)?.edges.push(newEdge.id);
    }

    return newEdge;
  }

  function updateEdge(
    edge: DeepPartial<Edge.TEdge> & { id: Edge.TEdge["id"] }
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

      if (sourceNode) {
        const sourceNodeRelations = sourceNode?.data.relations.filter(
          (relation) => relation.edges.includes(edge.id)
        );
        sourceNode.data.relations = sourceNodeRelations;
      }

      if (targetNode) {
        const targetNodeRelations = targetNode?.data.relations.filter(
          (relation) => relation.edges.includes(edge.id)
        );
        targetNode.data.relations = targetNodeRelations;
      }
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

    const validConnections = Tree.getConnectableNodes(connectionOriginNode.id)(
      syncedStore.edges
    );

    nonSyncedStore.validConnections = validConnections;
  }

  function abortConnecting() {
    nonSyncedStore.connectionSourceNodeId = "";
    nonSyncedStore.validConnections = [];
  }

  function connect(target: string, relationId: string) {
    if (nonSyncedStore.connectionSourceNodeId == null) return;

    addEdge(
      { source: nonSyncedStore.connectionSourceNodeId, target },
      relationId
    );
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
  };
}
