import {
  createChildNode,
  createCondition,
  createEdge,
  createInput,
  createNode,
} from "../Tree/creators";
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
  getNodes,
} from "../Tree/getters";
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
} from "../Tree/mutaters";
import { Tree } from "../Tree/type-classes";
import {
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
  isCircular,
} from "../Tree/utils";
import { isValidEdge } from "../Tree/validators";

export const createTreeClient = (tree: Tree.TTree) => {
  return {
    // The plural version of the Entities are immutable and contain standard functions to operate on
    // the tree data structure.
    updateStartNode: updateStartNode(tree),
    get: () => tree,
    nodes: {
      get: {
        byId: getNode(tree),
        connectableNodes: getConnectableNodes(tree),
        children: getChildren(tree),
        parents: getParents(tree),
        getPaths: getPaths(tree),
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

export type TTreeClient = ReturnType<typeof createTreeClient>;
