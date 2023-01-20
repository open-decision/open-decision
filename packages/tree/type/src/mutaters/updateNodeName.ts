import { TNodeId } from "@open-decision/tree-id";
import { getNodeSingle } from "../getters";
import { Tree } from "../type-classes";

export const updateNodeName =
  (tree: Tree.TTree) => (nodeId: TNodeId, name: string) => {
    const node = getNodeSingle(tree)(nodeId);

    if (!node) return;

    node.name = name;
  };
