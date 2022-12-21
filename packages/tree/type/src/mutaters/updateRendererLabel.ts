import { getNode } from "../getters";
import { Tree } from "../type-classes";

export const udpateRendererLabel =
  (tree: Tree.TTree) => (nodeId: string, newLabel: string) => {
    const node = getNode(tree)(nodeId);

    if (node instanceof Error) throw node;

    node.rendererButtonLabel = newLabel;
  };
