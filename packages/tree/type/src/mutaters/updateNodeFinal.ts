import { getNodeSingle } from "../getters";
import { TNodeId } from "../plugin";
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
