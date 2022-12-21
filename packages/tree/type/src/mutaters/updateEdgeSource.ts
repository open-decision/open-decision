import { getEdge } from "../getters";
import { Tree } from "../type-classes";

export const updateEdgeSource =
  (tree: Tree.TTree) => (edgeId: string, newSource: string) => {
    const edge = getEdge(tree)(edgeId);

    if (edge instanceof Error) throw edge;

    edge.source = newSource;
  };
