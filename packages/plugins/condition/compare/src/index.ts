import { TTreeClient } from "@open-decision/tree-type";
import { ConditionPluginObject } from "@open-decision/plugins-condition-helpers";
import { CompareConditionPlugin, DataType, TCompareCondition } from "./plugin";
import { resolver } from "./resolver";

export const createCompareConditionPlugin = (
  treeClient: TTreeClient
): ConditionPluginObject<typeof DataType, "compare", TCompareCondition> => {
  return {
    plugin: new CompareConditionPlugin(treeClient),
    type: "compare",
    resolver: resolver(treeClient),
  };
};

export { CompareConditionPlugin };
export type { TCompareCondition };
export { resolver };
