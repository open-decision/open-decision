import { getEdgeSingle } from "../getters";
import { TEdgeId, TNodeId } from "../plugin";
import { Tree } from "../type-classes";

export const updateEdgeSource =
  (tree: Tree.TTree) => (edgeId: TEdgeId, newSource: TNodeId) => {
    const edge = getEdgeSingle(tree)(edgeId);

    if (!edge) return;

    edge.source = newSource;
  };
