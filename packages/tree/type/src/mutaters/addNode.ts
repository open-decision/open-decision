import { INodePlugin } from "../plugin";
import { Tree } from "../type-classes";

/**
 * Always adds a new Node to the tree. There are no rules so this
 * will never fail. If there is no startNode the node is assigned
 * as the startNode.
 *
 * @param node to be added to the tree
 */
export const addNode = (tree: Tree.TTree) => (node: INodePlugin) => {
  if (!tree.nodes) tree.nodes = {};

  tree.nodes[node.id] = node;
  if (!tree.startNode) tree.startNode = node.id;
};
