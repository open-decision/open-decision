import {
  BuilderNode,
  BuilderRelation,
  BuilderTree,
} from "@open-decision/type-classes";
import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import { Doc } from "yjs";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export function createTreeStore() {
  const nonSyncedStore = proxy({
    selectedRelationId: "",
    selectedNodeId: "",
    connectionSourceNodeId: "",
    validConnections: [] as BuilderNode.TNode[],
  });

  const syncedStore = proxy({
    startNode: "",
    nodes: {} as BuilderNode.TNodesRecord,
    name: "",
  });

  const yDoc = new Doc();

  const yMap = yDoc.getMap("tree");

  bindProxyAndYMap(syncedStore, yMap, { transactionOrigin: "valtio" });

  function updateStartNode(startNode: string) {
    syncedStore.startNode = startNode;
  }

  function updateTreeName(name: string) {
    syncedStore.name = name;
  }

  function getNode(nodeId: string) {
    return syncedStore.nodes?.[nodeId];
  }

  function getRelation(nodeId: string, relationId: string) {
    return syncedStore.nodes?.[nodeId]?.relations[relationId];
  }

  function addNode(node: Parameters<typeof BuilderNode.create>[0]) {
    const newNode = BuilderNode.create(node);

    syncedStore.nodes[newNode.id] = newNode;

    if (syncedStore.startNode.length === 0) syncedStore.startNode = newNode.id;

    return newNode;
  }

  function updateNodeName(nodeId: string, name: string) {
    const node = getNode(nodeId);
    if (!node) return;

    node.name = name;
  }

  function updateNodePosition(
    nodeId: string,
    position: BuilderNode.TCoordinates
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.position = position;
  }

  function updateNodeContent(
    nodeId: string,
    content: BuilderNode.TNode["content"]
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.content = content;
  }

  function updateNodeRelations(
    nodeId: string,
    relations: BuilderRelation.TRecord
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    node.relations = relations;
  }

  function deleteNodes(ids: string[]) {
    ids.forEach((id) => {
      delete syncedStore.nodes?.[id];

      if (id === nonSyncedStore.selectedNodeId)
        nonSyncedStore.selectedNodeId = "";

      for (const nodeId in syncedStore.nodes) {
        const node = getNode(nodeId);

        for (const relationId in node?.relations) {
          const relation = node?.relations[relationId];

          if (relation?.target === id) delete relation.target;
        }
      }
    });
  }

  function addRelation(
    nodeId: string,
    relation: Omit<BuilderRelation.TRelation, "id">
  ) {
    //FIXME needs cicular relation check
    const newRelation = BuilderRelation.create(relation);
    const node = getNode(nodeId);
    if (!node) return;

    node.relations[newRelation.id] = newRelation;
  }

  function updateRelation(
    nodeId: string,
    relationId: string,
    newRelation: Omit<BuilderRelation.TRelation, "id">
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    //FIXME needs circular relation check
    const oldRelation = node.relations[relationId];

    node.relations[relationId] = {
      ...oldRelation,
      ...newRelation,
    };
  }

  function updateRelationAnswer(
    nodeId: string,
    relationId: string,
    answer: string
  ) {
    const relation = getRelation(nodeId, relationId);
    if (!relation) return;

    relation.answer = answer;
  }

  function updateRelationTarget(
    nodeId: string,
    relationId: string,
    target: string
  ) {
    const relation = getRelation(nodeId, relationId);
    if (!relation) return;
    //FIXME needs cirular relation check
    relation.target = target;
  }

  function deleteRelations(nodeId: string, relationIds: string[]) {
    relationIds.forEach((relationId) => {
      delete syncedStore.nodes?.[nodeId]?.relations[relationId];
    });
  }

  function selectNode(nodeId: string) {
    nonSyncedStore.selectedNodeId = nodeId;
  }

  function selectRelation(relationId: string) {
    nonSyncedStore.selectedRelationId = relationId;
  }

  function deselectRelation() {
    nonSyncedStore.selectedRelationId = "";
  }

  function startConnecting(sourceNodeId: string) {
    const connectionOriginNode = getNode(sourceNodeId);
    if (!connectionOriginNode) return;

    nonSyncedStore.connectionSourceNodeId = connectionOriginNode.id;

    nonSyncedStore.validConnections = BuilderTree.getConnectableNodes(
      connectionOriginNode
    )(syncedStore.nodes ?? {});
  }

  function abortConnecting() {
    nonSyncedStore.connectionSourceNodeId = "";
    nonSyncedStore.validConnections = [];
  }

  function connect(target: string) {
    if (nonSyncedStore.connectionSourceNodeId == null) return;

    addRelation(nonSyncedStore.connectionSourceNodeId, { target });
  }

  function addAssociatedNode(
    nodeId: string,
    relationId: string,
    newNodeData: Omit<Partial<BuilderNode.TNode>, "id">
  ) {
    const node = getNode(nodeId);
    if (!node) return;

    const newNode = BuilderNode.createNewAssociatedNode(node, newNodeData);

    addNode(newNode);
    updateRelationTarget(nodeId, relationId, newNode.id);

    return newNode;
  }

  return {
    syncedStore,
    nonSyncedStore,
    connect,
    addAssociatedNode,
    abortConnecting,
    startConnecting,
    deselectRelation,
    selectNode,
    selectRelation,
    deleteNodes,
    deleteRelations,
    updateNodeRelations,
    updateRelationAnswer,
    updateRelation,
    updateNodeContent,
    updateNodePosition,
    updateNodeName,
    updateStartNode,
    updateTreeName,
    addNode,
    updateRelationTarget,
    addRelation,
    yDoc,
  };
}
