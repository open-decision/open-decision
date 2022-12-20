import { SelectInputPluginObject } from "@open-decision/plugins-node-helpers";
import { z } from "zod";

const InputType = SelectInputPluginObject.plugin.Type;

export const decisionNodeInputPlugins = {
  [SelectInputPluginObject.type]: SelectInputPluginObject,
} as const;

export const decisionNodeInputType = InputType;

export function createVariableFromInput(
  input: z.infer<typeof decisionNodeInputType>,
  answer: any
) {
  return decisionNodeInputPlugins.select.plugin.variable.create(
    input.id,
    input.name ?? "",
    {
      value: answer,
      values: input.data.answers,
    }
  );
}

export type DecisionNodeVariable = ReturnType<typeof createVariableFromInput>;
