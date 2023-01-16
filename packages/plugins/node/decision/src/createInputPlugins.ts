import {
  TSelectInput,
  SelectInputPluginObject,
  createInputPluginGroup,
} from "@open-decision/plugins-node-helpers";

export const DecisionNodeInputPlugins = createInputPluginGroup({
  [SelectInputPluginObject.type]: SelectInputPluginObject,
});

export type TDecisionNodeInputs = TSelectInput;
