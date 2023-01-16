import { getEdgeSingle } from "../getters";
import { TEdgeId, TNodeId } from "../plugin";
import { Tree } from "../type-classes";

export const updateEdgeTarget =
  (tree: Tree.TTree) => (edgeId: TEdgeId, newTarget: TNodeId) => {
    const edge = getEdgeSingle(tree)(edgeId);

    if (!edge) return;

    edge.target = newTarget;
  };
