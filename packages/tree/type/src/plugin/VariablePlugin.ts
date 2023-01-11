import { ODError } from "@open-decision/type-classes";
import { z } from "zod";

export const VariablePluginBaseType = <
  TType extends string,
  TDataType extends z.ZodType
>(
  type: TType,
  data: TDataType
) =>
  z.object({
    id: z.string().uuid(),
    type: z.literal(type),
    data: data,
    name: z.string(),
  });

export type IVariablePluginBase<
  TType extends string = string,
  TData = any
> = z.infer<ReturnType<typeof VariablePluginBaseType<TType, z.ZodType<TData>>>>;

export abstract class VariablePlugin<
  TType extends IVariablePluginBase = IVariablePluginBase
> {
  pluginType = "variable" as const;
  type: TType["type"];
  declare Type: z.ZodType<TType>;

  constructor(type: TType["type"], Type: z.ZodType<TType>) {
    this.type = type;
    this.Type = Type;
  }

  parse = (data: any) => {
    const parsedData = this.Type.safeParse(data);

    if (!parsedData.success) {
      return new ODError({
        code: "VALIDATION_ERROR",
        message: `The data provided to the variable plugin is not of the correct Type.`,
        additionalData: { errors: parsedData.error },
      });
    }

    return parsedData.data;
  };
}

export type VariableType<TZodType extends z.ZodType> = z.infer<TZodType>;
