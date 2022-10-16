import { Tree } from "../type-classes";
import { getConditions } from "./getCondition";
import { getEdges } from "./getEdge";

export const getConditionByNode = (tree: Tree.TTree) => (nodeId: string) => {
  const edges = getEdges(tree)();
  const conditions = getConditions(tree)();

  const edgesOfNode = Object.values(edges ?? {}).filter(
    (edge) => edge.source === nodeId
  );

  return Object.values(conditions ?? {}).find((condition) =>
    edgesOfNode.find((edge) => edge.conditionId === condition.id)
  );
};
