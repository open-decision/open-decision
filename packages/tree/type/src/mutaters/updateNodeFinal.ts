import { TNodeId } from "@open-decision/tree-ids";
import { getNodeSingle } from "../getters";
import { Tree } from "../type-classes";

export const updateNodeFinal =
  (tree: Tree.TTree) => (nodeId: TNodeId, isFinal: boolean) => {
    const node = getNodeSingle(tree)(nodeId);

    if (!node) return;

    if (isFinal === false) {
      delete node.final;
    } else {
      node.final = isFinal;
    }
  };
