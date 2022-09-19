import { getEdge } from "../getters";
import { Tree } from "../type-classes";

export const updateEdgeTarget =
  (tree: Tree.TTree) => (edgeId: string, newTarget: string) => {
    const edge = getEdge(tree)(edgeId);

    edge.target = newTarget;
  };
