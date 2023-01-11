import {
  ISelectInput,
  SelectInputPluginObject,
} from "@open-decision/plugins-node-helpers";
import { SingleSelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { match } from "ts-pattern";

const SingleSelectVariable = new SingleSelectVariablePlugin();
export const decisionNodeInputPlugins = {
  [SelectInputPluginObject.type]: SelectInputPluginObject,
};

export type TDecisionNodeInputs = ISelectInput;

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
