import { Condition, TTreeClient } from "@open-decision/tree-type";
import { ConditionPlugin } from "@open-decision/plugins-condition-helpers";
import { z } from "zod";

export const typeName = "compare" as const;

export const DataType = z.object({
  variableId: z.string().uuid(),
  valueId: z.string().uuid(),
});

export class CompareConditionPlugin extends ConditionPlugin<
  typeof DataType,
  "compare"
> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, "compare");
  }

  getConditionByValueId = (valueId: string, nodeId?: string) => {
    let conditions: Record<string, Condition.TCondition> | undefined;

    if (nodeId) {
      const nodeConditions = this.treeClient.conditions.get.byNode(nodeId);
      if (!nodeConditions) return;
      conditions = nodeConditions;
    } else {
      conditions = this.treeClient.conditions.get.all();
    }

    const edges = this.treeClient.edges.get.all();

    if (!edges || !conditions) return undefined;

    const edge = Object.values(edges).find((edge) => {
      if (!edge.conditionId || !conditions) return false;
      const condition = conditions[edge.conditionId];

      if (!this.isType(condition)) return false;

      return condition.data.valueId === valueId;
    });

    return edge;
  };
}

export type TCompareCondition = z.infer<CompareConditionPlugin["Type"]>;
