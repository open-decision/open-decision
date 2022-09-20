import { Tree } from "../type-classes";
import { getCondition, getEdge } from "../getters";

export const connectEdgeAndCondition =
  (tree: Tree.TTree) => (edgeId: string, conditionId: string) => {
    const edge = getEdge(tree)(edgeId);
    // We get the condition just to validate that it exists.
    getCondition(tree)(conditionId);

    edge.conditionId = conditionId;
  };
