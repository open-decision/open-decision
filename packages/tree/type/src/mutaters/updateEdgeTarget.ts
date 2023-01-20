import { TEdgeId, TNodeId } from "@open-decision/tree-ids";
import { getEdgeSingle } from "../getters";
import { Tree } from "../type-classes";

export const updateEdgeTarget =
  (tree: Tree.TTree) => (edgeId: TEdgeId, newTarget: TNodeId) => {
    const edge = getEdgeSingle(tree)(edgeId);

    if (!edge) return;

    edge.target = newTarget;
  };
