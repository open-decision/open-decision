import { Tree, Node } from "../type-classes";
import { pipe } from "remeda";
import { addInput } from "./addInput";
import { createInput, createNode, NewNodeData } from "../creators";

/**
 * @description Always adds a new Node to the tree. There are no rules so this
 * will never fail.
 *
 * @param node - Accepts a partial or full Node. A partial Node is used to create a new Node,
 * while a full Node is directly added to the Tree.
 */
export const addNode = (tree: Tree.TTree) => (node: Node.TNode) => {
  if (!tree.nodes) tree.nodes = {};

  tree.nodes[node.id] = node;
  if (!tree.startNode) tree.startNode = node.id;
};

export const createAndAddNode = (tree: Tree.TTree) => (node: NewNodeData) => {
  if (node.data.inputs.length === 0) {
    const newInput = createInput();

    node.data.inputs.push(newInput.id);
    addInput(tree)(newInput);
  }

  return pipe(node, createNode, addNode(tree));
};
