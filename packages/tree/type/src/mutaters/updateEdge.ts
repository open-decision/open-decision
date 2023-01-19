import { getEdgeSingle } from "../getters";
import { IEdge, TEdgeId } from "../plugin";
import { Tree } from "../type-classes";

export const updateEdge =
  (tree: Tree.TTree) => (edgeId: TEdgeId, newEdge: IEdge) => {
    const edge = getEdgeSingle(tree)(edgeId);

    if (!edge) return;

    tree.edges[edgeId] = { ...newEdge, id: edgeId };
  };
