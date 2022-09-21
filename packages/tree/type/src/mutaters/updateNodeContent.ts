import { Tree, Node } from "../type-classes";
import { getNode } from "../getters";

export const updateNodeContent =
  (tree: Tree.TTree) => (nodeId: string, content: Node.TNode["content"]) => {
    const node = getNode(tree)(nodeId);

    node.content = content;
  };
