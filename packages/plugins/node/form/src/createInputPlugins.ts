import {
  createMultiSelectInputPlugin,
  SelectInputPluginObject,
  createTextInputPlugin,
} from "@open-decision/plugins-node-helpers";
import { ODProgrammerError } from "@open-decision/type-classes";
import { match } from "ts-pattern";
import { z } from "zod";

const MultiSelectInput = createMultiSelectInputPlugin();
const TextInput = createTextInputPlugin();

export const formNodeInputPlugins = {
  [MultiSelectInput.type]: MultiSelectInput,
  [TextInput.type]: TextInput,
  [SelectInputPluginObject.type]: SelectInputPluginObject,
};

export const formNodeInputType = z.union([
  MultiSelectInput.plugin.Type,
  TextInput.plugin.Type,
  SelectInputPluginObject.plugin.Type,
]);

export function createVariableFromInput(
  input: z.infer<typeof formNodeInputType>,
  answer: any
) {
  return match(input)
    .with({ type: "text" }, (input) => {
      if (answer && typeof answer !== "string")
        throw new ODProgrammerError({
          code: "INVALID_ANSWER_TYPE",
          message:
            "You provided an array of answers for a text input that only accepts a single string.",
        });

      const variable = formNodeInputPlugins.text.plugin.variable.create(
        input.id,
        input.name ?? "",
        {
          value: answer,
        }
      );

      return variable;
    })
    .with({ type: "select" }, (input) => {
      if (answer && typeof answer !== "string")
        throw new ODProgrammerError({
          code: "INVALID_ANSWER_TYPE",
          message:
            "You provided an array of answers for a select input that only accepts a single string.",
        });

      const variable = formNodeInputPlugins.select.plugin.variable.create(
        input.id,
        input.name ?? "",
        {
          values: input.data.answers,
          value: answer,
        }
      );

      return variable;
    })
    .with({ type: "multi-select" }, (input) => {
      if (typeof answer === "string")
        throw new ODProgrammerError({
          code: "INVALID_ANSWER_TYPE",
          message:
            "You provided a string as an answer for a multi select input that only accepts an array of strings.",
        });

      const variable = formNodeInputPlugins[
        "multi-select"
      ].plugin.variable.create(input.id, input.name ?? "", {
        values: input.data.answers,
        value: answer,
      });

      return variable;
    })
    .run();
}

export type FormNodeVariable = Record<
  string,
  ReturnType<typeof createVariableFromInput>
>;
