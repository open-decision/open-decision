import { TTreeClient } from "@open-decision/tree-sync";
import { ConditionPlugin } from "@open-decision/condition-plugins-helpers";
import { z } from "zod";

export const Type = z.object({ type: z.literal("direct") });

export class DirectPlugin extends ConditionPlugin<typeof Type, "direct"> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, Type, "direct");
  }

  getBy = {
    node: (nodeId: string) => {
      const conditions = this.treeClient.conditions.get.byNode(nodeId);

      if (!conditions) return undefined;

      const compareConditions: Record<string, TDirectCondition> = {};

      for (const key in conditions) {
        const value = conditions[key];

        if (!this.isType(value)) return;

        compareConditions[key] = value;
      }

      return compareConditions;
    },
  };
}

export type TDirectCondition = z.infer<DirectPlugin["MergedType"]>;
