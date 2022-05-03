import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const updateNodeName =
  (tree: Tree.TTree) => (nodeId: string, name: string) => {
    const node = getNode(tree)(nodeId);
    if (!node) return;

    node.data.name = name;
  };
