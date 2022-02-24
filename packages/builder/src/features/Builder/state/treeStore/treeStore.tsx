import * as Y from "yjs";
import {
  BuilderNode,
  BuilderRelation,
  BuilderTree,
} from "@open-decision/type-classes";
import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";

type TreeMeta = {
  name: string;
  id: number;
  status: "uninitialized" | "initialized";
  selectedNodeId?: string;
  selectedRelationId?: string;
  connectionSourceNodeId?: string;
  validConnections?: BuilderNode.TNode[];
};

export const yDoc = new Y.Doc();
const yTreeMap = yDoc.getMap("tree");

export const treeStore = proxy({
  metadata: {} as TreeMeta,
  treeData: {} as BuilderTree.TTree["treeData"],
});

bindProxyAndYMap(treeStore, yTreeMap);

export function updateStartNode(startNode: string) {
  treeStore.treeData.startNode = startNode;
}

export function updateTreeName(name: string) {
  treeStore.metadata.name = name;
}

export function getNode(nodeId: string) {
  return treeStore.treeData.nodes?.[nodeId];
}

export function getRelation(nodeId: string, relationId: string) {
  return treeStore.treeData.nodes?.[nodeId].relations[relationId];
}

export function addNode(node: Parameters<typeof BuilderNode.create>[0]) {
  const newNode = BuilderNode.create(node);
  if (!treeStore.treeData.nodes) treeStore.treeData.nodes = {};

  treeStore.treeData.nodes[newNode.id] = newNode;

  return newNode;
}

export function updateNodeName(nodeId: string, name: string) {
  const node = getNode(nodeId);
  if (!node) return;

  node.name = name;
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
  content: BuilderNode.TNode["content"]
) {
  const node = getNode(nodeId);
  if (!node) return;

  node.content = content;
}

export function updateNodeRelations(
  nodeId: string,
  relations: BuilderRelation.TRecord
) {
  const node = getNode(nodeId);
  if (!node) return;

  node.relations = relations;
}

export function deleteNodes(ids: string[]) {
  ids.forEach((id) => {
    delete treeStore.treeData.nodes?.[id];

    for (const nodeId in treeStore.treeData.nodes) {
      const node = getNode(nodeId);

      for (const relationId in node?.relations) {
        const relation = node?.relations[relationId];

        if (relation?.target === id) delete relation.target;
      }
    }
  });
}

export function addRelation(
  nodeId: string,
  relation: Omit<BuilderRelation.TRelation, "id">
) {
  //FIXME needs cicular relation check
  const newRelation = BuilderRelation.create(relation);
  const node = getNode(nodeId);
  if (!node) return;

  node.relations[newRelation.id] = newRelation;
}

export function updateRelation(
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

export function updateRelationAnswer(
  nodeId: string,
  relationId: string,
  answer: string
) {
  const relation = getRelation(nodeId, relationId);
  if (!relation) return;

  relation.answer = answer;
}

export function updateRelationTarget(
  nodeId: string,
  relationId: string,
  target: string
) {
  const relation = getRelation(nodeId, relationId);
  if (!relation) return;
  //FIXME needs cirular relation check
  relation.target = target;
}

export function deleteRelations(nodeId: string, relationIds: string[]) {
  relationIds.forEach((relationId) => {
    delete treeStore.treeData.nodes?.[nodeId].relations[relationId];
  });
}

export function selectNode(nodeId: string) {
  treeStore.metadata.selectedNodeId = nodeId;
}

export function selectRelation(relationId: string) {
  treeStore.metadata.selectedRelationId = relationId;
}

export function deselectRelation() {
  treeStore.metadata.selectedRelationId = "";
}

export function startConnecting(sourceNodeId: string) {
  const connectionOriginNode = getNode(sourceNodeId);
  if (!connectionOriginNode) return;

  treeStore.metadata.connectionSourceNodeId = connectionOriginNode.id;

  treeStore.metadata.validConnections = BuilderTree.getConnectableNodes(
    connectionOriginNode
  )(treeStore.treeData.nodes);
}

export function abortConnecting() {
  treeStore.metadata.connectionSourceNodeId = undefined;
  treeStore.metadata.validConnections = undefined;
}

export function connect(target: string) {
  if (treeStore.metadata.connectionSourceNodeId == null) return;

  addRelation(treeStore.metadata.connectionSourceNodeId, { target });
}

export function hasNodes() {
  return Object.values(treeStore.treeData.nodes ?? {}).length > 0;
}

export function addAssociatedNode(
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
