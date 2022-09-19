import { Node, Tree } from "../type-classes";
import { getNodes } from "./getNode";
import { isEmpty } from "ramda";

/**
 * Provide a condition id and receive the nodes that are related to it.
 * Returns undefined if there are no nodes.
 */
export const getNodesByCondition =
  (tree: Tree.TTree) => (conditionId: string) => {
    const nodes = getNodes(tree)();

    if (!nodes) return undefined;

    const relatedNodes: Node.TRecord = {};
    for (const key in tree.nodes) {
      const node = tree.nodes[key];

      if (node.data.conditions.includes(conditionId)) {
        relatedNodes[key] = node;
      }
    }

    // If the resulting conditions are empty we return undefined, because it is more meaningful and
    // easier to handle downstream.
    if (isEmpty(relatedNodes)) return undefined;

    return relatedNodes;
  };
