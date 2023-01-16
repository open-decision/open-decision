import { getNodeSingle } from "../getters";
import { TNodeId } from "../plugin";
import { Tree } from "../type-classes";

export const updateNodeName =
  (tree: Tree.TTree) => (nodeId: TNodeId, name: string) => {
    const node = getNodeSingle(tree)(nodeId);

    if (!node) return;

    node.name = name;
  };
