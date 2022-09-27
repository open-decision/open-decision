import { Input, Plugin, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) => Input.Type.extend({ data: Type, type: z.literal(typeName) });

export class InputPlugin<
  TType extends z.ZodType,
  TTypeName extends string
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  declare treeClient: TTreeClient;
  declare typeName: TTypeName;
  pluginType = "input" as const;

  constructor(treeClient: TTreeClient, Type: TType, typeName: TTypeName) {
    super(treeClient, mergeTypes(Type, typeName));

    this.typeName = typeName;
  }

  create(data: z.infer<TType>) {
    const newInput = this.treeClient.inputs.create({
      data,
      type: this.typeName,
    });

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
}
