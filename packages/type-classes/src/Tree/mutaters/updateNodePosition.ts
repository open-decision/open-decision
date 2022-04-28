import { Tree, Node } from "../type-classes";
import { getNode } from "../getters";

export const updateNodePosition =
  (tree: Tree.TTree) => (nodeId: string, position: Node.TCoordinates) => {
    const node = getNode(tree)(nodeId);
    if (!node) return;

    node.position.x = position.x;
    node.position.y = position.y;
  };
