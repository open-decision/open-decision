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
} from "./utils/";
import { BaseVariableType } from "@open-decision/variable-plugins-helpers";

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

  /**
   * You almost certainly do not want to use this directly, but use a plugin instead.
   * This is a low-level function that is used by plugins to create a new node.
   * @param data can be anything as long as it includes a type property
   * @returns the data merged with a unique id
   */

  create(data: z.infer<TType>) {
    const newInput = merge(data, { id: uuid() });

    const parsedInput = this.Type.safeParse(newInput);

    if (!parsedInput.success) {
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
