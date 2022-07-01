import { ConditionPlugin, TBaseTreeClient } from "@open-decision/type-classes";
import { Type } from "./types";
import { z } from "zod";

export class DirectPlugin extends ConditionPlugin<typeof Type, "direct"> {
  constructor(treeClient: TBaseTreeClient) {
    super(treeClient, Type, "direct");
  }

  getBy = {
    node: (nodeId: string) => {
      const conditions = this.treeClient.conditions.getBy.node(nodeId);

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
