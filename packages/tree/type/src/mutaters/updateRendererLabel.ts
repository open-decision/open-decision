import { getNode } from "../getters";
import { Tree } from "../type-classes";

export const udpateRendererLabel =
  (tree: Tree.TTree) => (nodeId: string, newLabel: string) => {
    const node = getNode(tree)(nodeId);

    node.rendererButtonLabel = newLabel;
  };
