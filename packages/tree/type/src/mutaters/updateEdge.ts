import { getEdge } from "../getters";
import { Edge, Tree } from "../type-classes";

export const updateEdge =
  (tree: Tree.TTree) => (edgeId: string, newEdge: Edge.TEdge) => {
    const edge = getEdge(tree)(edgeId);

    if (edge instanceof Error) return edge;

    tree.edges[edgeId] = { ...newEdge, id: edgeId };

    return true;
  };
