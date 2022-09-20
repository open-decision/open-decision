import { Tree, Node } from "../type-classes";
import { getNode } from "../getters";

export const updateNodeContent =
  (tree: Tree.TTree) =>
  (nodeId: string, content: Node.TNodeData["content"]) => {
    const node = getNode(tree)(nodeId);

    node.data.content = content;
  };
