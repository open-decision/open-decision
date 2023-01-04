import { getNode } from "../getters";
import { Tree } from "../type-classes";

export const updateNodeFinal =
  (tree: Tree.TTree) => (nodeId: string, isFinal: boolean) => {
    const node = getNode(tree)(nodeId);

    if (node instanceof Error) throw node;

    if (isFinal === false) {
      delete node.final;
    } else {
      node.final = isFinal;
    }
  };
