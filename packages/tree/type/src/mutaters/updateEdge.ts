import { getEdgeSingle } from "../getters";
import { IEdgePlugin, TEdgeId } from "../plugin";
import { Tree } from "../type-classes";

export const updateEdge =
  (tree: Tree.TTree) => (edgeId: TEdgeId, newEdge: IEdgePlugin) => {
    const edge = getEdgeSingle(tree)(edgeId);

    if (!edge) return;

    tree.edges[edgeId] = { ...newEdge, id: edgeId };
  };
