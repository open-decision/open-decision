import {
  TSelectInput,
  SelectInputPluginObject,
} from "@open-decision/plugins-node-helpers";

export const DecisionNodeInputPlugins = {
  [SelectInputPluginObject.type]: SelectInputPluginObject,
};

export type TDecisionNodeInputs = TSelectInput;
