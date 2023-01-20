import { TEdgeId } from "@open-decision/tree-id";
import { getEdgeSingle } from "../getters";
import { IEdge } from "../plugin";
import { Tree } from "../type-classes";

export const updateEdge =
  (tree: Tree.TTree) => (edgeId: TEdgeId, newEdge: IEdge) => {
    const edge = getEdgeSingle(tree)(edgeId);

    if (!edge) return;

    tree.edges[edgeId] = { ...newEdge, id: edgeId };
  };
