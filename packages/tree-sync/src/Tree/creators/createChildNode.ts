import { getNode } from "../getters";
import { Tree } from "../type-classes";
import { createNode, NewNodeData } from "./createNode";

export const createChildNode =
  (tree: Tree.TTree) => (nodeId: string, newNode: NewNodeData) => {
    // Get the node we want the children for
    const node = getNode(tree)(nodeId);

    // Fitler the edges to only include the ones with the given node as the source
    const numberOfEdges = Object.values(tree.edges ?? {}).filter(
      (edge) => edge.source === nodeId
    ).length;

    // The new node position is somewhat displaced from the parent node
    const position = {
      x: node.position.x + 5 * numberOfEdges,
      y: node.position.y + 80 + 50,
    };

    return createNode({
      ...newNode,
      position,
    });
  };
