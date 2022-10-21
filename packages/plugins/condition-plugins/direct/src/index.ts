export * from "./plugin";

import { TTreeClient } from "@open-decision/tree-type";
import { ConditionPluginObject } from "@open-decision/condition-plugins-helpers";
import { DataType, TDirectCondition, DirectConditionPlugin } from "./plugin";
import { resolver } from "./resolver";

export const createDirectConditionPlugin = (
  treeClient: TTreeClient
): ConditionPluginObject<typeof DataType, "direct", TDirectCondition> => {
  return {
    plugin: new DirectConditionPlugin(treeClient),
    type: "compare",
    resolver: resolver(treeClient),
  };
};
