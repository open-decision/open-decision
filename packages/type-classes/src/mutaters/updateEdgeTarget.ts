import { getEdge, getNode } from "../getters";
import { Tree } from "../type-classes";

export const updateEdgeTarget =
  (tree: Tree.TTree) => (edgeId: string, newTarget: string) => {
    const edge = getEdge(tree)(edgeId);
    const newTargetNode = getNode(tree)(newTarget);
    if (!edge || !newTargetNode) return;

    edge.target = newTarget;
  };
