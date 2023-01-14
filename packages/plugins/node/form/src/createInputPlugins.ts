import {
  MultiSelectInputPluginObject,
  SelectInputPluginObject,
  TextInputPluginObject,
  PlaceholderInputPluginObject,
  IMultiSelectInput,
  ITextInput,
  ISelectInput,
  IPlaceholderInput,
} from "@open-decision/plugins-node-helpers";
import { ODProgrammerError } from "@open-decision/type-classes";
import { match } from "ts-pattern";
import { z } from "zod";

export const formNodeInputPlugins = {
  [MultiSelectInputPluginObject.type]: MultiSelectInputPluginObject,
  [TextInputPluginObject.type]: TextInputPluginObject,
  [SelectInputPluginObject.type]: SelectInputPluginObject,
  [PlaceholderInputPluginObject.type]: PlaceholderInputPluginObject,
};

export const FormNodeInputType = z.discriminatedUnion("type", [
  MultiSelectInputPluginObject.plugin.Type,
  TextInputPluginObject.plugin.Type,
  SelectInputPluginObject.plugin.Type,
  PlaceholderInputPluginObject.plugin.Type,
]);

export type IFormNodeInput =
  | IMultiSelectInput
  | ITextInput
  | ISelectInput
  | IPlaceholderInput;

export function createVariableFromInput(input: IFormNodeInput, answer: any) {
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
    .with({ type: "placeholder" }, () => undefined)
    .run();
}

export type FormNodeVariable = Record<
  string,
  ReturnType<typeof createVariableFromInput>
>;
