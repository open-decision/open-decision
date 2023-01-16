import { Tree, Node } from "../type-classes";
import { getNodeSingle } from "../getters";
import { TNodeId } from "../plugin";

export const updateNodePosition =
  (tree: Tree.TTree) => (nodeId: TNodeId, position: Node.TCoordinates) => {
    const node = getNodeSingle(tree)(nodeId);

    if (!node) return;

    node.position.x = position.x;
    node.position.y = position.y;
  };
