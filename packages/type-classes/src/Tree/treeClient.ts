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
} from "./getters";
import {
  updateStartNode,
  deleteNodes,
  addNode,
  connectConditionAndNode,
  connectInputAndNode,
  disconnectInputFromNode,
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
        byInput: null,
        byCondition: null,
        byEdge: null,
      },
      delete: deleteNodes(tree),
      create: { node: createNode, childNode: createChildNode(tree) },
      add: addNode(tree),
      connect: {
        toCondition: connectConditionAndNode(tree),
        toInput: connectInputAndNode(tree),
        toEdge: null,
      },
      disconnect: {
        fromInput: disconnectInputFromNode(tree),
        fromCondition: null,
        fromEdge: null,
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
        byCondition: null,
        byEdge: null,
      },
      delete: deleteInputs(tree),
      create: createInput,
      add: addInput(tree),
      connect: {
        toNode: connectInputAndNode(tree),
        toCondition: connectInputAndCondition(tree),
        toEdge: null,
      },
      disconnect: {
        fromNode: disconnectInputFromNode(tree),
        fromCondition: null,
        fromEdge: null,
      },
      update: updateInput(tree),
    },
    conditions: {
      get: {
        single: getCondition(tree),
        collection: getConditions(tree),
        all: () => tree.conditions as TTree["conditions"],
        byNode: getConditionsByNode(tree.nodes ?? {}, tree.conditions ?? {}),
        byInput: null,
        byEdge: null,
      },
      delete: deleteConditions(tree),
      create: createCondition,
      add: addCondition(tree),
      connect: {
        toNode: connectConditionAndNode(tree),
        toInput: connectInputAndCondition(tree),
        toEdge: null,
      },
      disconnect: {
        fromNode: null,
        fromInput: null,
        fromEdge: null,
      },
    },
    edges: {
      get: {
        single: getEdge(tree),
        collection: getEdges(tree),
        all: () => tree.edges,
        byNode: getEdgesByNode(tree.edges ?? {}),
        byInput: null,
        byCondition: getEdgesByCondition(tree.edges ?? {}),
      },
      delete: deleteEdges(tree),
      create: createEdge(tree),
      add: addEdge(tree),
      update: {
        target: updateEdgeTarget(tree),
      },
      rules: {
        isCircular: isCircular(tree),
        isValid: isValidEdge(tree),
      },
      connect: {
        toNode: null,
        toInput: null,
        toCondition: null,
      },
      disconnect: {
        fromNode: null,
        fromInput: null,
        fromCondition: null,
      },
    },
  };
};
