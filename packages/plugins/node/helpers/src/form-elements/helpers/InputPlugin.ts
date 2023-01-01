import {
  Plugin,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";
import { merge } from "remeda";
import { Input } from ".";
import { v4 as uuid } from "uuid";
import { deleteInput, updateInput, addInput } from "./utils";
import { VariablePlugin } from "@open-decision/plugins-variable-helpers";
import { ODProgrammerError } from "@open-decision/type-classes";

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) => Input.Type.extend({ data: Type, type: z.literal(typeName) });

export abstract class InputPlugin<
  TType extends z.ZodType = any,
  TTypeName extends string = any,
  TVariablePlugin extends VariablePlugin = VariablePlugin<any, any>
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  pluginType = "input" as const;

  declare variable: TVariablePlugin;
  declare defaultData: { [key: string]: any };

  constructor(Type: TType, typeName: TTypeName, variable: TVariablePlugin) {
    super(mergeTypes(Type, typeName));

    this.variable = variable;
    this.typeName = typeName;
  }

  getInput =
    (inputId: string) => (treeClient: TReadOnlyTreeClient | TTreeClient) => {
      return treeClient.pluginEntity.get.single<typeof this.Type>(
        "inputs",
        inputId
      );
    };

  getInputs =
    (inputIds: string[]) => (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return treeClient.pluginEntity.get.collection<typeof this.Type>(
        "inputs",
        inputIds
      );
    };

  create(data?: Omit<z.infer<typeof this.Type>, "id" | "type">) {
    const newInput = merge(data, {
      id: uuid(),
      type: this.typeName,
      required: false,
      data: this.defaultData,
    });

    return this.parse(newInput);
  }

  parse(input: unknown) {
    const parsedInput = this.Type.safeParse(input);

    if (!parsedInput.success) {
      console.error(parsedInput.error);
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The input could not be created. Please check that the data is correct.",
      });
    }

    return parsedInput.data;
  }

  updateLabel =
    (inputId: string, newLabel: string) => (treeClient: TTreeClient) => {
      const input = treeClient.pluginEntity.get.single<typeof this.Type>(
        "inputs",
        inputId
      );

      if (!input) return;

      input.label = newLabel;
    };

  updateInput = updateInput;

  addInput = addInput;

  deleteInput = deleteInput;
}
