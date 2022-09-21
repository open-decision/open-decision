import { Node, Tree } from "../type-classes";
import { isEmpty } from "ramda";
import { getNodes } from "./getNode";

/**
 * Provide an input id and receive the nodes that are related to it.
 * Returns undefined if there are no nodes.
 */
export const getNodesByInput = (tree: Tree.TTree) => (inputId: string) => {
  const nodes = getNodes(tree)();

  if (!nodes) return undefined;

  const relatedNodes: Node.TRecord = {};
  for (const key in tree.nodes) {
    const node = tree.nodes[key];

    if (node.inputs.includes(inputId)) {
      relatedNodes[key] = node;
    }
  }

  // If the resulting conditions are empty we return undefined, because it is more meaningful and
  // easier to handle downstream.
  if (isEmpty(relatedNodes)) return undefined;

  return relatedNodes;
};
