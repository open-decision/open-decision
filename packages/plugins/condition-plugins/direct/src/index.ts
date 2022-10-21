export * from "@open-decision/condition-plugins-direct/src/plugin";

import { TTreeClient } from "@open-decision/tree-type";
import { ConditionPluginObject } from "@open-decision/condition-plugins-helpers";
import { DirectConditionPlugin, DataType, TDirectCondition } from "@open-decision/condition-plugins-direct/src/plugin";
import { resolver } from "@open-decision/condition-plugins-direct/src/resolver";

export const createDirectConditionPlugin = (
  treeClient: TTreeClient
): ConditionPluginObject<typeof DataType, "direct", TDirectCondition> => {
  return {
    plugin: new DirectConditionPlugin(treeClient),
    type: "compare",
    resolver: resolver(treeClient),
  };
};
