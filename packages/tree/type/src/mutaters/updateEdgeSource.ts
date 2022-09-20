import { getEdge } from "../getters";
import { Tree } from "../type-classes";

export const updateEdgeSource =
  (tree: Tree.TTree) => (edgeId: string, newSource: string) => {
    const edge = getEdge(tree)(edgeId);

    edge.source = newSource;
  };
