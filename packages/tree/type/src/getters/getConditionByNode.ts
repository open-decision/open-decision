import { Tree } from "../type-classes";
import { getConditions } from "./getCondition";

export const getConditionByNode = (tree: Tree.TTree) => (nodeId: string) => {
  const conditions = getConditions(tree)();

  return Object.values(conditions ?? {}).find(
    (condition) => condition.nodeId === nodeId
  );
};
