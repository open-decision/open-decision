import { TTreeClient } from "@open-decision/tree-type";
import { ConditionPlugin } from "@open-decision/plugins-condition-helpers";
import { z } from "zod";

export const typeName = "direct" as const;

export const DataType = z.void();

export class DirectConditionPlugin extends ConditionPlugin<
  typeof DataType,
  typeof typeName
> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, typeName);
  }
}

export type TDirectCondition = z.infer<DirectConditionPlugin["Type"]>;
