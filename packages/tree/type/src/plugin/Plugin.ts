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

  parse = (input: unknown) => {
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
  };
}

export abstract class PluginGroup<
  TName extends string,
  TPluginType extends z.AnyZodObject,
  TType extends z.ZodDiscriminatedUnion<"type", TPluginType[]>
> {
  name: TName;
  Type: TType;

  constructor(name: TName, Type: TType) {
    this.Type = Type;
    this.name = name;
  }
}
