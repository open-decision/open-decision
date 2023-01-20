import { TNodeId } from "@open-decision/tree-id";
import { getNodeSingle } from "../getters";
import { Tree } from "../type-classes";

export const udpateRendererLabel =
  (tree: Tree.TTree) => (nodeId: TNodeId, newLabel: string) => {
    const node = getNodeSingle(tree)(nodeId);

    if (!node) return;

    node.rendererButtonLabel = newLabel;
  };
