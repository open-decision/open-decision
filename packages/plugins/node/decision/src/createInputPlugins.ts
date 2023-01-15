import {
  TSelectInput,
  SelectInputPluginObject,
} from "@open-decision/plugins-node-helpers";

export const DecisionNodeInputPlugins = {
  [SelectInputPluginObject.type]: SelectInputPluginObject,
};

export const DecisionNodeInputType = SelectInputPluginObject.plugin.Type;

export type TDecisionNodeInputs = TSelectInput;
