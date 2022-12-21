import { getEdge } from "../getters";
import { Tree } from "../type-classes";

export const updateEdgeTarget =
  (tree: Tree.TTree) => (edgeId: string, newTarget: string) => {
    const edge = getEdge(tree)(edgeId);

    if (edge instanceof Error) throw edge;

    edge.target = newTarget;
  };
