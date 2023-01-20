import { TEdgeId, TNodeId } from "@open-decision/tree-ids";
import { getEdgeSingle } from "../getters";
import { Tree } from "../type-classes";

export const updateEdgeSource =
  (tree: Tree.TTree) => (edgeId: TEdgeId, newSource: TNodeId) => {
    const edge = getEdgeSingle(tree)(edgeId);

    if (!edge) return;

    edge.source = newSource;
  };
