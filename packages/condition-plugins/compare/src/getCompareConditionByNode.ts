import { Condition, TTreeClient } from "@open-decision/type-classes";
import { isCompareCondition, TCompareCondition } from "./types";

export const getCompareConditionByNode =
  (treeClient: TTreeClient) => (nodeId: string) => {
    const conditions = treeClient.conditions.getBy.node(nodeId);

    if (!conditions) return undefined;

    const compareConditions: Record<string, TCompareCondition> = {};

    for (const key in conditions) {
      const value = conditions[key];

      if (!isCompareCondition(value)) return;

      compareConditions[key] = value;
    }

    return compareConditions;
  };
