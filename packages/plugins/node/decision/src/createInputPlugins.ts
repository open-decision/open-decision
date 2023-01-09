import { SelectInputPluginObject } from "@open-decision/plugins-node-helpers";
import { match } from "ts-pattern";
import { z } from "zod";

const InputType = SelectInputPluginObject.plugin.Type;

export const decisionNodeInputPlugins = {
  [SelectInputPluginObject.type]: SelectInputPluginObject,
};

export const decisionNodeInputType = InputType;

export function createVariableFromInput(
  input: z.infer<typeof decisionNodeInputType>,
  answer: any
) {
  return match(input)
    .with({ type: "select" }, (input) =>
      decisionNodeInputPlugins.select.plugin.variable.create(
        input.id,
        input.name ?? "",
        {
          value: answer,
          values: input.data.answers,
        }
      )
    )
    .run();
}

export type DecisionNodeVariable = ReturnType<typeof createVariableFromInput>;
