import { getEdge } from "../getters";
import { Tree } from "../type-classes";

export const disconnectEdgeAndCondition =
  (tree: Tree.TTree) => (edgeId: string) => {
    const edge = getEdge(tree)(edgeId);

    delete edge.conditionId;
  };
