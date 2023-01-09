import { Plugin, PluginGroup } from "@open-decision/tree-type";
import { z } from "zod";
import { Input } from ".";
import {
  deleteInput,
  updateInput,
  addInput,
  getInput,
  getInputs,
  updateInputLabel,
} from "./utils/inputMethods";
import { VariablePlugin } from "@open-decision/plugins-variable-helpers";

export type createFn<TType extends z.ZodType> = (
  data: Omit<z.infer<TType>, "id" | "type" | "data"> & {
    data?: z.infer<TType>["data"];
  }
) => z.infer<TType>;

export abstract class InputPlugin<
  TData extends z.ZodType = any,
  TType extends string = any,
  TVariablePlugin extends VariablePlugin = VariablePlugin<any, any>
> extends Plugin<TType, TData, Input.TType<TType, TData>> {
  pluginType = "input" as const;
  declare variable: TVariablePlugin;
  declare defaultData: { [key: string]: any };

  constructor(data: TData, type: TType, variable: TVariablePlugin) {
    super(Input.Type(type, data));

    this.variable = variable;
    this.type = type;
  }

  abstract create: createFn<typeof this.Type>;

  getInput = getInput(this.Type);

  getInputs = getInputs(this.Type);

  updateLabel = updateInputLabel(this.Type);

  updateInput = updateInput;

  addInput = addInput;

  deleteInput = deleteInput;
}

export class InputPluginGroup<
  TName extends string = string,
  TType extends z.ZodDiscriminatedUnion<
    "type",
    Input.TType<string>[]
  > = z.ZodDiscriminatedUnion<"type", Input.TType<string>[]>
> extends PluginGroup<TName, Input.TType<string>, TType> {
  pluginType = "inputGroup" as const;

  getInput = getInput(this.Type);
  getInputs = getInputs(this.Type);

  addInput = addInput;
  updateLabel = updateInputLabel(this.Type);

  deleteInput = deleteInput;
}
