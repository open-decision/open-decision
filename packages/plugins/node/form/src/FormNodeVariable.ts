import { EmptyVariablePlugin } from "@open-decision/plugins-variable-empty";
import { MultiSelectVariablePlugin } from "@open-decision/plugins-variable-multi-select";
import { SelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { TextVariablePlugin } from "@open-decision/plugins-variable-text";
import { match } from "ts-pattern";
import { z } from "zod";
import { TFormNodeInput } from "./FormNodeInputs";
import { TFormNode } from "./formNodePlugin";

const TextVariable = new TextVariablePlugin();
const SelectVariable = new SelectVariablePlugin();
const MultiSelectVariable = new MultiSelectVariablePlugin();
const EmptyVariable = new EmptyVariablePlugin();

export const FormNodeVariableType = z.discriminatedUnion("type", [
  TextVariable.Type,
  MultiSelectVariable.Type,
  SelectVariable.Type,
  EmptyVariable.Type,
]);

export function createVariableFromInput(
  node: TFormNode,
  input: TFormNodeInput,
  answer: any,
  readable = false
) {
  return match(input)
    .with({ type: "text" }, () =>
      TextVariable.create(node, { value: answer }, readable)
    )
    .with({ type: "select" }, (input) =>
      SelectVariable.create(
        node,
        { values: input.data.answers, value: answer },
        readable
      )
    )
    .with({ type: "multi-select" }, (input) =>
      MultiSelectVariable.create(
        node,
        { values: input.data.answers, value: answer },
        readable
      )
    )
    .with({ type: "placeholder" }, () =>
      EmptyVariable.create(node, {}, readable)
    )
    .run();
}

export type TFormNodeVariable = Record<
  string,
  z.infer<typeof FormNodeVariableType>
>;
