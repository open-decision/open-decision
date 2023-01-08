import { Plugin, PluginGroup } from "@open-decision/tree-type";
import { z } from "zod";
import { Input } from ".";
import {
  deleteInput,
  updateInput,
  addInput,
  getInput,
  getInputs,
  parse,
  updateInputLabel,
} from "./utils/inputMethods";
import { VariablePlugin } from "@open-decision/plugins-variable-helpers";

export type createFn<TType extends z.ZodType> = (
  data: Omit<z.infer<TType>, "id" | "type">
) => z.infer<TType>;

export abstract class InputPlugin<
  TData extends z.ZodType = any,
  TType extends string = any,
  TVariablePlugin extends VariablePlugin = VariablePlugin<any, any>
> extends Plugin<TType, TData, ReturnType<typeof Input.Type<TType, TData>>> {
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

  parse = parse(this.Type);

  updateLabel = updateInputLabel(this.Type);

  updateInput = updateInput;

  addInput = addInput;

  deleteInput = deleteInput;
}

export class InputPluginGroup<
  TName extends string = string,
  TType extends z.ZodType = any
> extends PluginGroup<TName, TType> {
  pluginType = "inputGroup" as const;

  getInput = getInput(this.Type);
  getInputs = getInputs(this.Type);

  parse = parse(this.Type);

  addInput = addInput;

  deleteInput = deleteInput;
}
