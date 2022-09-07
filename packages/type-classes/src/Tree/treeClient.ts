import { mergeDeepRight } from "ramda";
import { merge } from "remeda";
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
} from "./getters";
import { getConditionsByNode } from "./getters/getConditionsByNode";
import { getEdgesByNode } from "./getters/getEdgesByNode";
import { getNodeOptions } from "./getters/getNodeOptions";
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
} from "./mutaters";
import { Tree } from "./type-classes";
import { Type } from "./type-classes/Edge";
import { TTree } from "./type-classes/Tree";
import {
  getConnectableNodes,
  getChildren,
  getParents,
  getPaths,
  isCircular,
} from "./utils";
import { isValidEdge } from "./validators";

export type TBaseTreeClient = ReturnType<typeof createTreeClient>;

export const createTreeClient = (tree: TTree) => {
  return {
    updateStartNode: updateStartNode(tree),
    get: () => tree,
    validate: Type.safeParse,
    nodes: {
      get: {
        single: getNode(tree),
        collection: getNodes(tree),
        all: () => tree.nodes,
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
        all: () => tree.inputs,
        byNode: null,
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
      update: {
        target: null,
      },
    },
    conditions: {
      get: {
        single: getCondition(tree),
        collection: getConditions(tree),
        all: () => tree.conditions,
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
        byCondition: null,
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

type PluginConfig = {
  condition?: Record<string, any>;
  input?: Record<string, any>;
};

export type Plugins<TPlugins extends PluginConfig> =
  TPlugins extends infer Plugins ? Plugins : never;

export type createTreeClientConfig<TPlugins extends PluginConfig> = ReturnType<
  typeof createExtendedTreeClient<Plugins<TPlugins>>
>;

export const createExtendedTreeClient =
  <
    TPlugins extends PluginConfig,
    TConditions = (keyof TPlugins["condition"])[],
    TInputs = (keyof TPlugins["input"])[]
  >(
    plugins: (baseTreeClient: TBaseTreeClient) => TPlugins
  ) =>
  (tree: Tree.TTree) => {
    const baseTreeClient = createTreeClient(tree);
    const calledPlugins = plugins(baseTreeClient);
    // This is not really a type safe way to do it. By the nature of JavaScript it can not be assured that
    // the plugins object as not been modified. We do however assert that it has not, because of convenience.
    const pluginsWithTypes = mergeDeepRight(calledPlugins, {
      input: {
        types: Object.keys(calledPlugins.input ?? {}) as unknown as TInputs,
      },
      condition: {
        types: Object.keys(
          calledPlugins.condition ?? {}
        ) as unknown as TConditions,
      },
    });

    return merge(baseTreeClient, pluginsWithTypes);
  };
