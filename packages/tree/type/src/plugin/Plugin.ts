import { ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";

export abstract class Plugin<
  TTypeName extends string,
  TDataType extends z.ZodType,
  TType extends z.ZodObject<{
    type: z.ZodLiteral<TTypeName>;
    data: TDataType;
    id: z.ZodString;
  }>
> {
  type: TTypeName;
  Type: TType;

  constructor(Type: TType) {
    this.Type = Type;
    this.type = this.Type.shape.type.value;
  }
}

export abstract class PluginGroup<
  TName extends string,
  TType extends z.ZodType
> {
  name: TName;
  Type: TType;

  constructor(name: TName, Type: TType) {
    this.Type = Type;
    this.name = name;
  }

  safeParse(entity: unknown) {
    const parsedNode = this.Type.safeParse(entity);

    if (!parsedNode.success) {
      console.error(parsedNode.error);
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The node could not be created. Please check that the data is correct.",
      });
    }

    return parsedNode.data;
  }
}
