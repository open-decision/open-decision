import {
  createNode,
  createChildNode,
  createCondition,
  createEdge,
} from "./creators";
import {
  getNode,
  getNodes,
  getCondition,
  getConditions,
  getEdge,
  getEdges,
  getEdgesByCondition,
  getEdgesByNode,
  getNodeOptions,
  getNodesByEdge,
  getConditionByEdge,
  getPluginEntity,
  getPluginEntities,
  getEntirePluginEntity,
  getConditionsByNode,
} from "./getters";
import {
  updateStartNode,
  deleteNodes,
  addNode,
  updateNodeName,
  updateNodePosition,
  deleteConditions,
  addCondition,
  deleteEdges,
  addEdge,
  updateEdgeTarget,
  connectEdgeAndCondition,
  disconnectEdgeAndCondition,
  updateEdgeSource,
  addPluginEntity,
  deletePluginEntity,
} from "./mutaters";
import { Tree } from "./type-classes";
import {
  getConnectableNodes,
  getChildren,
  getParents,
  getPaths,
  isCircular,
} from "./utils";
import { isValidEdge } from "./validators";

export type TTreeClient = ReturnType<typeof createTreeClient<Tree.TTree>>;

export function createTreeClient<TTree extends Tree.TTree>(tree: TTree) {
  return {
    updateStartNode: updateStartNode(tree),
    pluginEntity: {
      add: addPluginEntity(tree),
      delete: deletePluginEntity(tree),
      get: {
        single: getPluginEntity(tree),
        all: getEntirePluginEntity(tree),
        collection: getPluginEntities(tree),
      },
    },
    get: () => tree,
    nodes: {
      get: {
        single: getNode(tree),
        collection: getNodes(tree),
        all: () => tree.nodes as TTree["nodes"],
        connectableNodes: getConnectableNodes(tree),
        children: getChildren(tree),
        parents: getParents(tree),
        paths: getPaths(tree),
        options: getNodeOptions(tree),
        byEdge: getNodesByEdge(tree),
      },
      delete: deleteNodes(tree),
      create: { node: createNode, childNode: createChildNode(tree) },
      add: addNode(tree),
      connect: {
        toEdgeAsTarget: updateEdgeTarget(tree),
        toEdgeAsSource: updateEdgeSource(tree),
      },
      disconnect: {
        /**
         * Disconnecting from an Edge is equivalent to deleting it, because there cannot be
         * an Edge without source and target. If you want to update the connection
         * use nodes.connect.toEdgeAsTarget or edges.connect.toEdgeAsSource.
         */
        fromEdgeAsTarget: (id: string) => deleteEdges(tree)([id]),
        fromEdgeAsSource: (id: string) => deleteEdges(tree)([id]),
      },
      update: {
        name: updateNodeName(tree),
        position: updateNodePosition(tree),
      },
    },
    conditions: {
      get: {
        single: getCondition(tree),
        collection: getConditions(tree),
        all: () => tree.conditions as TTree["conditions"],
        byEdge: getConditionByEdge(tree),
        byNode: getConditionsByNode(tree),
      },
      delete: deleteConditions(tree),
      create: createCondition,
      add: addCondition(tree),
      connect: {
        toEdge: connectEdgeAndCondition(tree),
      },
      disconnect: {
        fromEdge: disconnectEdgeAndCondition(tree),
      },
    },
    edges: {
      get: {
        single: getEdge(tree),
        collection: getEdges(tree),
        all: () => tree.edges,
        byNode: getEdgesByNode(tree),
        byCondition: getEdgesByCondition(tree),
      },
      delete: deleteEdges(tree),
      create: createEdge(tree),
      add: addEdge(tree),
      rules: {
        isCircular: isCircular(tree),
        isValid: isValidEdge(tree),
      },
      connect: {
        toTargetNode: updateEdgeTarget(tree),
        toSourceNode: updateEdgeSource(tree),
        toCondition: connectEdgeAndCondition(tree),
      },
      disconnect: {
        /**
         * Disconnecting an Edge is equivalent to deleting it, because there cannot be
         * an Edge without source and target. If you want to update the connection
         * use edges.connect.toTargetNode or edges.connect.toSourceNode.
         */
        fromTargetNode: (id: string) => deleteEdges(tree)([id]),
        /**
         * Disconnecting an Edge is equivalent to deleting it, because there cannot be
         * an Edge without source and target. If you want to update the connection
         * use edges.connect.toTargetNode or edges.connect.toSourceNode.
         */
        fromSourceNode: (id: string) => deleteEdges(tree)([id]),
        fromCondition: disconnectEdgeAndCondition(tree),
      },
    },
  };
}
