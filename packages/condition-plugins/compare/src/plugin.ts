import { TTreeClient } from "@open-decision/tree-type";
import { ConditionPlugin } from "@open-decision/condition-plugins-helpers";
import { z } from "zod";

export const type = "compare" as const;

export const Type = z.object({
  answerId: z.string().uuid(),
});

export class ComparePlugin extends ConditionPlugin<typeof Type, "compare"> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, Type, "compare");
  }

  getBy = {
    node: (nodeId: string) => {
      const conditions = this.treeClient.conditions.get.byNode(nodeId);

      if (!conditions) return undefined;

      const compareConditions: Record<string, TCompareCondition> = {};

      for (const key in conditions) {
        const value = conditions[key];

        if (!this.isType(value)) return;

        compareConditions[key] = value;
      }

      return compareConditions;
    },

    answer: (answerId: string, nodeId?: string) => {
      const conditions = nodeId
        ? this.getBy.node(nodeId)
        : this.treeClient.conditions.get.all();

      const edges = nodeId
        ? this.treeClient.edges.get.single(nodeId)
        : this.treeClient.edges.get.all();

      if (!edges || !conditions) return undefined;

      const edge = Object.values(edges).find((edge) => {
        if (!edge.conditionId || !conditions) return false;
        const condition = conditions[edge.conditionId];

        if (!this.isType(condition)) return false;

        return condition.data.answerId === answerId;
      });

      return edge;
    },
  };
}

export type TCompareCondition = z.infer<ComparePlugin["MergedType"]>;
