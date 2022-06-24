import { TTreeClient } from "@open-decision/type-classes";
import { comparePlugin } from "./comparePlugin";
import { isCompareCondition } from "./types";

export const getCompareConditionByAnswer =
  (treeClient: TTreeClient) => (answerId: string, nodeId?: string) => {
    const conditions = nodeId
      ? comparePlugin(treeClient).getBy.node(nodeId)
      : treeClient.conditions.getAll();

    const edges = nodeId
      ? treeClient.edges.getBy.node(nodeId)
      : treeClient.edges.getAll();

    if (!edges || !conditions) return undefined;

    const edge = Object.values(edges).find((edge) => {
      if (!edge.conditionId || !conditions) return false;
      const condition = conditions[edge.conditionId];

      if (!isCompareCondition(condition)) return false;

      return condition.valueId === answerId;
    });

    return edge;
  };
