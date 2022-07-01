import {
  createChildNode,
  createCondition,
  createEdge,
  createInput,
  createNode,
} from "../creators";
import {
  getCondition,
  getConditions,
  getConditionsByNode,
  getEdge,
  getEdges,
  getEdgesByNode,
  getInput,
  getInputs,
  getNode,
  getNodeNames,
  getNodeOptions,
  getNodes,
} from "../getters";
import {
  addCondition,
  addEdge,
  addInput,
  addNode,
  deleteConditions,
  deleteEdges,
  deleteInputs,
  deleteNodes,
  relateConditionToNode,
  relateInputToCondition,
  relateInputToNode,
  removeInputFromNode,
  updateEdgeTarget,
  updateNodeContent,
  updateNodeName,
  updateNodePosition,
  updateStartNode,
} from "../mutaters";
import { Tree } from "../type-classes";
import {
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
  isCircular,
} from "../utils";
import { isValidEdge } from "../validators";
import { merge } from "remeda";
import { mergeDeepRight } from "ramda";

export const createTreeClient = (tree: Tree.TTree) => {
  return {
    updateStartNode: updateStartNode(tree),
    get: () => tree,
    validate: Tree.Type.safeParse,
    // The plural version of the Entities are immutable and contain standard functions to operate on
    // the tree data structure.
    nodes: {
      get: {
        byId: getNode(tree),
        connectableNodes: getConnectableNodes(tree),
        children: getChildren(tree),
        parents: getParents(tree),
        getPaths: getPaths(tree),
        options: getNodeOptions(tree),
      },
      getN: { byId: getNodes(tree), onlyWithNames: getNodeNames(tree) },
      getAll: () => tree.nodes,
      deleteN: deleteNodes(tree),
      create: createNode,
      createChild: createChildNode(tree),
      add: addNode(tree),
      connect: { toCondition: relateConditionToNode(tree) },
      disconnect: { input: removeInputFromNode(tree) },
      updateContent: updateNodeContent(tree),
      updateName: updateNodeName(tree),
      updatePosition: updateNodePosition(tree),
    },
    inputs: {
      get: getInput(tree),
      getN: getInputs(tree),
      getAll: () => tree.inputs,
      deleteN: deleteInputs(tree),
      create: createInput,
      add: addInput(tree),
      connect: {
        toNode: relateInputToNode(tree),
        toCondition: relateInputToCondition(tree),
      },
    },
    conditions: {
      get: getCondition(tree),
      getN: getConditions(tree),
      getBy: {
        node: getConditionsByNode(tree.nodes ?? {}, tree.conditions ?? {}),
      },
      getAll: () => tree.conditions,
      deleteN: deleteConditions(tree),
      create: createCondition,
      add: addCondition(tree),
    },
    edges: {
      get: getEdge(tree),
      getN: getEdges(tree),
      getBy: {
        node: getEdgesByNode(tree.edges ?? {}),
      },
      getAll: () => tree.edges,
      deleteN: deleteEdges(tree),
      create: createEdge(tree),
      add: addEdge(tree),
      updateTarget: updateEdgeTarget(tree),
      isCircular: isCircular(tree),
      isValid: isValidEdge(tree),
    },
  };
};

type PluginConfig = {
  condition?: Record<string, any>;
  input?: Record<string, any>;
};

export type TBaseTreeClient = ReturnType<typeof createTreeClient>;

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
    plugins: (tree: TBaseTreeClient) => TPlugins
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
