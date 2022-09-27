import { TTreeClient } from "@open-decision/tree-type";
import { ConditionPlugin } from "@open-decision/condition-plugins-helpers";
import { z } from "zod";

export const typeName = "direct" as const;

export const Type = z.void();

export class DirectConditionPlugin extends ConditionPlugin<
  typeof Type,
  typeof typeName
> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, Type, typeName);
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

export type TDirectCondition = z.infer<DirectConditionPlugin["Type"]>;
