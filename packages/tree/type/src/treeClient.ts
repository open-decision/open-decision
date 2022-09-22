import {
  createNode,
  createChildNode,
  createInput,
  createCondition,
  createEdge,
} from "./creators";
import {
  getNode,
  getNodes,
  getInput,
  getInputs,
  getCondition,
  getConditions,
  getEdge,
  getEdges,
  getConditionsByNode,
  getEdgesByCondition,
  getEdgesByNode,
  getInputsByNode,
  getNodeOptions,
  getNodesByInput,
  getNodesByCondition,
  getNodesByEdge,
  getInputByCondition,
  getInputByEdge,
  getConditionByInput,
  getConditionByEdge,
  getEdgesByInput,
} from "./getters";
import {
  updateStartNode,
  deleteNodes,
  addNode,
  connectInputAndNode,
  disconnectInputAndNode,
  updateNodeContent,
  updateNodeName,
  updateNodePosition,
  deleteInputs,
  addInput,
  connectInputAndCondition,
  deleteConditions,
  addCondition,
  deleteEdges,
  addEdge,
  updateEdgeTarget,
  updateInput,
  disconnectInputAndCondition,
  connectEdgeAndCondition,
  disconnectEdgeAndCondition,
  updateEdgeSource,
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

export const createTreeClient = <TTree extends Tree.TTree>(tree: TTree) => {
  return {
    updateStartNode: updateStartNode(tree),
    get: () => tree,
    validate: Tree.Type.safeParse,
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
        byInput: getNodesByInput(tree),
        byCondition: getNodesByCondition(tree),
        byEdge: getNodesByEdge(tree),
      },
      delete: deleteNodes(tree),
      create: { node: createNode, childNode: createChildNode(tree) },
      add: addNode(tree),
      connect: {
        toInput: connectInputAndNode(tree),
        toEdgeAsTarget: updateEdgeTarget(tree),
        toEdgeAsSource: updateEdgeSource(tree),
      },
      disconnect: {
        fromInput: disconnectInputAndNode(tree),
        /**
         * Disconnecting from an Edge is equivalent to deleting it, because there cannot be
         * an Edge without source and target. If you want to update the connection
         * use nodes.connect.toEdgeAsTarget or edges.connect.toEdgeAsSource.
         */
        fromEdgeAsTarget: (id: string) => deleteEdges(tree)([id]),
        fromEdgeAsSource: (id: string) => deleteEdges(tree)([id]),
      },
      update: {
        content: updateNodeContent(tree),
        name: updateNodeName(tree),
        position: updateNodePosition(tree),
      },
    },
    inputs: {
      get: {
        single: getInput(tree),
        collection: getInputs(tree),
        all: () => tree.inputs as TTree["inputs"],
        byNode: getInputsByNode(tree),
        byCondition: getInputByCondition(tree),
        byEdge: getInputByEdge(tree),
      },
      delete: deleteInputs(tree),
      create: createInput,
      add: addInput(tree),
      connect: {
        toNode: connectInputAndNode(tree),
        toCondition: connectInputAndCondition(tree),
        /**
         * Edges are not connectable to inputs in the normal way, but through conditions.
         */
        toEdge: null,
      },
      disconnect: {
        fromNode: disconnectInputAndNode(tree),
        fromCondition: disconnectInputAndCondition(tree),
        /**
         * Edges are not connectable to inputs in the normal way, but through conditions.
         */
        fromEdge: null,
      },
      update: updateInput(tree),
    },
    conditions: {
      get: {
        single: getCondition(tree),
        collection: getConditions(tree),
        all: () => tree.conditions as TTree["conditions"],
        byNode: getConditionsByNode(tree),
        byInput: getConditionByInput(tree),
        byEdge: getConditionByEdge(tree),
      },
      delete: deleteConditions(tree),
      create: createCondition,
      add: addCondition(tree),
      connect: {
        toInput: connectInputAndCondition(tree),
        toEdge: connectEdgeAndCondition(tree),
      },
      disconnect: {
        fromInput: disconnectInputAndCondition(tree),
        fromEdge: disconnectEdgeAndCondition(tree),
      },
    },
    edges: {
      get: {
        single: getEdge(tree),
        collection: getEdges(tree),
        all: () => tree.edges,
        byNode: getEdgesByNode(tree),
        byInput: getEdgesByInput(tree),
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
};
