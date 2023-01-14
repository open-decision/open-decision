import {
  ISelectInput as TSelectInput,
  SelectInputPluginObject,
} from "@open-decision/plugins-node-helpers";
import { SingleSelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { match } from "ts-pattern";

const SingleSelectVariable = new SingleSelectVariablePlugin();

export const DecisionNodeInputPlugins = {
  [SelectInputPluginObject.type]: SelectInputPluginObject,
};

export const DecisionNodeInputType = SelectInputPluginObject.plugin.Type;

export type TDecisionNodeInputs = TSelectInput;

export function createVariableFromInput(
  input: TDecisionNodeInputs,
  answer: any
) {
  return match(input)
    .with({ type: "select" }, (input) =>
      SingleSelectVariable.create(input.id, input.name ?? "", {
        value: answer,
        values: input.data.answers,
      })
    )
    .run();
}

export type DecisionNodeVariable = ReturnType<typeof createVariableFromInput>;
