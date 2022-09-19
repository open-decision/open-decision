import { getNode } from "../getters";
import { Tree, Node } from "../type-classes";
import { createNode, NewNodeData } from "./createNode";

export const createChildNode =
  (tree: Tree.TTree) =>
  (nodeId: string, newNode: NewNodeData): Node.TNode | Error => {
    const node = getNode(tree)(nodeId);
    if (!node)
      return new Error(`The parent node of id ${nodeId} could not be found.`);

    const numberOfEdges = Object.values(tree.edges ?? {}).filter(
      (edge) => edge.source === nodeId
    ).length;

    const position = {
      x: node.position.x + 5 * numberOfEdges,
      y: node.position.y + 80 + 50,
    };

    return createNode({
      ...newNode,
      position,
    });
  };
