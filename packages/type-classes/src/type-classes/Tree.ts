import { z } from "zod";
import { Condition, Edge, Input, Node } from "./";

import {
  createAnswer,
  createChildNode,
  createCondition,
  createEdge,
  createInput,
  createNode,
} from "../creators";
import { getCondition, getEdge, getInput, getNode, getTree } from "../getters";
import {
  addCondition,
  addEdge,
  addInput,
  addInputAnswer,
  addNode,
  createAndAddCondition,
  createAndAddEdge,
  createAndAddInput,
  createAndAddNode,
  deleteConditions,
  deleteEdges,
  deleteInputAnswer,
  deleteInputs,
  deleteNodes,
  relateConditionToNode,
  relateInputToCondition,
  relateInputToNode,
  removeInputFromNode,
  updateEdgeTarget,
  updateInputAnswer,
  updateInputAnswerOrder,
  updateNodeContent,
  updateNodeName,
  updateNodePosition,
  updateStartNode,
} from "../mutaters";
import {
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
  isCircular,
} from "../utils";
import { isValidEdge } from "../validators";

export const Type = z.object({
  startNode: z.string().optional(),
  nodes: Node.Record.optional(),
  edges: Edge.Record.optional(),
  inputs: Input.Record.optional(),
  conditions: Condition.Record.optional(),
});

// ------------------------------------------------------------------
// Methods

export function createTreeMethods(tree: TTree) {
  return {
    addCondition: addCondition(tree),
    addEdge: addEdge(tree),
    addInput: addInput(tree),
    addInputAnswer: addInputAnswer(tree),
    addInputToCondition: relateInputToCondition(tree),
    addNode: addNode(tree),
    createAndAddCondition: createAndAddCondition(tree),
    createAndAddEdge: createAndAddEdge(tree),
    createAndAddInput: createAndAddInput(tree),
    createAndAddNode: createAndAddNode(tree),
    createAnswer,
    createChildNode: createChildNode(tree),
    createCondition,
    createEdge: createEdge(tree),
    createInput,
    createNode,
    deleteConditions: deleteConditions(tree),
    deleteEdges: deleteEdges(tree),
    deleteInputAnswer: deleteInputAnswer(tree),
    deleteInputs: deleteInputs(tree),
    deleteNodes: deleteNodes(tree),
    getChildren: getChildren(tree),
    getCondition: getCondition(tree),
    getConnectableNodes: getConnectableNodes(tree),
    getEdge: getEdge(tree),
    getInput: getInput(tree),
    getNode: getNode(tree),
    getParents: getParents(tree),
    getPaths: getPaths(tree),
    getTree: getTree(tree),
    isCircular: isCircular(tree),
    isValidEdge: isValidEdge(tree),
    relateConditionToNode: relateConditionToNode(tree),
    relateInputToNode: relateInputToNode(tree),
    removeInputFromNode: removeInputFromNode(tree),
    updateEdgeTarget: updateEdgeTarget(tree),
    updateInputAnswer: updateInputAnswer(tree),
    updateInputAnswerOrder: updateInputAnswerOrder(tree),
    updateNodeContent: updateNodeContent(tree),
    updateNodeName: updateNodeName(tree),
    updateNodePosition: updateNodePosition(tree),
    updateStartNode: updateStartNode(tree),
  };
}

export {
  addCondition,
  addEdge,
  addInput,
  addInputAnswer,
  addNode,
  createAndAddCondition,
  createAndAddEdge,
  createAndAddInput,
  createAndAddNode,
  createAnswer,
  createChildNode,
  createCondition,
  createEdge,
  createInput,
  createNode,
  deleteConditions,
  deleteEdges,
  deleteInputAnswer,
  deleteInputs,
  deleteNodes,
  getCondition,
  getEdge,
  getInput,
  getNode,
  getTree,
  isValidEdge,
  relateConditionToNode,
  relateInputToCondition,
  relateInputToNode,
  removeInputFromNode,
  updateEdgeTarget,
  updateInputAnswer,
  updateInputAnswerOrder,
  updateNodeContent,
  updateNodeName,
  updateNodePosition,
  updateStartNode,
};

export type TTree = z.infer<typeof Type>;
