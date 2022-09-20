import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const updateNodeName =
  (tree: Tree.TTree) => (nodeId: string, name: string) => {
    const node = getNode(tree)(nodeId);

    node.data.name = name;
  };
