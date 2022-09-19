import { Tree, Node } from "../type-classes";

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
