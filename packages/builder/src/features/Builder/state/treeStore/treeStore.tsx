import * as Y from "yjs";
import { bindProxyAndYMap } from "valtio-yjs";
import {
  BuilderNode,
  BuilderRelation,
  BuilderTree,
} from "@open-decision/type-classes";
import { proxy } from "valtio";

export const yDoc = new Y.Doc();

export const yTreeMap = yDoc.getMap("tree");

export const undoManager = new Y.UndoManager(yTreeMap);

export type TStore = {
  value: BuilderTree.TTree & {
    status: "uninitialized" | "initialized";
    selectedNodeId?: string;
    selectedRelationId?: string;
    connectionSourceNode?: BuilderNode.TNode;
    validConnections?: BuilderNode.TNode[];
  };
};

export const treeStore = proxy<TStore>({
  value: {
    status: "uninitialized",
    id: 0,
    name: "",
    treeData: { nodes: {}, startNode: "" },
  },
} as TStore);

bindProxyAndYMap(treeStore, yTreeMap);

export function updateStartNode(startNode: string) {
  treeStore.value.treeData.startNode = startNode;
}

export function updateTreeName(name: string) {
  treeStore.value.name = name;
}

export function getNode(nodeId: string) {
  return treeStore.value.treeData.nodes[nodeId];
}

export function getRelation(nodeId: string, relationId: string) {
  return treeStore.value.treeData.nodes[nodeId].relations[relationId];
}

export function addNode(node: Parameters<typeof BuilderNode.create>[0]) {
  const newNode = BuilderNode.create(node);

  treeStore.value.treeData.nodes[newNode.id] = newNode;

  return newNode;
}

export function updateNodeName(nodeId: string, name: string) {
  getNode(nodeId).name = name;
}

export function updateNodePosition(
  nodeId: string,
  position: BuilderNode.TCoordinates
) {
  getNode(nodeId).position = position;
}

export function updateNodeContent(
  nodeId: string,
  content: BuilderNode.TNode["content"]
) {
  getNode(nodeId).content = content;
}

export function updateNodeRelations(
  nodeId: string,
  relations: BuilderRelation.TRecord
) {
  getNode(nodeId).relations = relations;
}

export function deleteNodes(ids: string[]) {
  ids.forEach((id) => {
    delete treeStore.value.treeData.nodes[id];

    for (const nodeId in treeStore.value.treeData.nodes) {
      const node = getNode(nodeId);

      for (const relationId in node.relations) {
        const relation = node.relations[relationId];

        if (relation.target === id) delete relation.target;
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

  getNode(nodeId).relations[newRelation.id] = newRelation;
}

export function updateRelation(
  nodeId: string,
  relationId: string,
  newRelation: Omit<BuilderRelation.TRelation, "id">
) {
  //FIXME needs circular relation check
  let oldRelation = getNode(nodeId).relations[relationId];

  oldRelation = {
    ...oldRelation,
    ...newRelation,
  };
}

export function updateRelationAnswer(
  nodeId: string,
  relationId: string,
  answer: string
) {
  getRelation(nodeId, relationId).answer = answer;
}

export function updateRelationTarget(
  nodeId: string,
  relationId: string,
  target: string
) {
  //FIXME needs cirular relation check
  getRelation(nodeId, relationId).target = target;
}

export function deleteRelations(nodeId: string, relationIds: string[]) {
  relationIds.forEach((relationId) => {
    delete treeStore.value.treeData.nodes[nodeId].relations[relationId];
  });
}

export function selectNode(nodeId: string) {
  treeStore.value.selectedNodeId = nodeId;
}

export function selectRelation(relationId: string) {
  treeStore.value.selectedRelationId = relationId;
}

export function deselectRelation() {
  treeStore.value.selectedRelationId = "";
}

export function startConnecting(sourceNodeId: string) {
  const connectionOriginNode = getNode(sourceNodeId);

  treeStore.value.connectionSourceNode = connectionOriginNode;

  treeStore.value.validConnections = BuilderTree.getConnectableNodes(
    connectionOriginNode
  )(treeStore.value.treeData.nodes);
}

export function abortConnecting() {
  treeStore.value.connectionSourceNode = undefined;
  treeStore.value.validConnections = undefined;
}

export function connect(target: string) {
  if (treeStore.value.connectionSourceNode == null) return;

  addRelation(treeStore.value.connectionSourceNode.id, { target });
}

export function hasNodes() {
  return Object.values(treeStore.value.treeData.nodes).length > 0;
}

export function addAssociatedNode(
  nodeId: string,
  relationId: string,
  newNodeData: Omit<Partial<BuilderNode.TNode>, "id">
) {
  const node = getNode(nodeId);

  const newNode = BuilderNode.createNewAssociatedNode(node, newNodeData);

  addNode(newNode);
  updateRelationTarget(nodeId, relationId, newNode.id);

  return newNode;
}
