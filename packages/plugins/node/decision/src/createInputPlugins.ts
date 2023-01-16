import {
  TSelectInput,
  SelectInputPluginObject,
} from "@open-decision/plugins-node-helpers";

export const DecisionNodeInputPlugins = {
  [SelectInputPluginObject.type]: SelectInputPluginObject.plugin,
};

export type TDecisionNodeInputs = TSelectInput;
