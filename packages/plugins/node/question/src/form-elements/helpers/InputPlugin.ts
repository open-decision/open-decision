import { Plugin, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";
import { merge } from "remeda";
import { Input } from ".";
import { v4 as uuid } from "uuid";
import {
  deleteInput,
  updateInput,
  getInput,
  getInputs,
  addInput,
} from "./utils";
import { BaseVariableType } from "@open-decision/plugins-variable-helpers";

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) => Input.Type.extend({ data: Type, type: z.literal(typeName) });

export class InputPlugin<
  TType extends z.ZodType,
  TTypeName extends string,
  TVariableType extends typeof BaseVariableType
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  declare treeClient: TTreeClient;
  declare typeName: TTypeName;
  declare VariableType: TVariableType;
  pluginType = "input" as const;

  constructor(
    treeClient: TTreeClient,
    Type: TType,
    typeName: TTypeName,
    VariableType: TVariableType
  ) {
    super(treeClient, mergeTypes(Type, typeName));

    this.typeName = typeName;
    this.VariableType = VariableType;
  }

  create(data?: Omit<z.infer<typeof this.Type>, "id" | "type">) {
    const newInput = merge(data, {
      id: uuid(),
      type: this.typeName,
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

  updateInput = updateInput(this.treeClient);

  getInput = getInput(this.treeClient, this.Type);

  getInputs = getInputs(this.treeClient, this.Type);

  addInput = addInput;

  deleteInput = deleteInput(this.treeClient);

  getVariable(input: z.infer<typeof this.Type>): z.infer<TVariableType> {
    return { id: input.id };
  }
}
