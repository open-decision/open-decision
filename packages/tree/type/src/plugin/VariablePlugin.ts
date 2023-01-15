import { ODError } from "@open-decision/type-classes";
import { z } from "zod";

export const VariablePluginBaseType = <
  TType extends string,
  TValue extends z.ZodTypeAny,
  TDataType extends z.ZodObject<{ value: TValue }>
>(
  type: TType,
  data: TDataType
) =>
  z
    .object({
      id: z.string().uuid(),
      type: z.literal(type),
      name: z.string().optional(),
    })
    .merge(data);

export type TVariablePluginBase<
  TType extends string = string,
  TValue extends z.ZodTypeAny = z.ZodTypeAny,
  TData extends z.ZodObject<{ value: TValue }> = z.ZodObject<{ value: TValue }>
> = z.infer<ReturnType<typeof VariablePluginBaseType<TType, TValue, TData>>>;

export abstract class VariablePlugin<
  TType extends TVariablePluginBase = TVariablePluginBase,
  TZodType extends z.AnyZodObject = z.AnyZodObject
> {
  pluginType = "variable" as const;
  type: TType["type"];
  declare Type: TZodType;

  constructor(type: TType["type"], Type: TZodType) {
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

  abstract create: (
    data: Partial<Omit<TType, "type">> & Pick<TType, "id">
  ) => TType;

  createReadableKey = (key: string) =>
    key
      .split(" ")
      .join("_")
      .replace(/\u00df/g, "ss")
      .replace(/\u00e4/g, "ae")
      .replace(/\u00f6/g, "oe")
      .replace(/\u00fc/g, "ue")
      .replace(/\u00c4/g, "Ae")
      .replace(/\u00d6/g, "Oe")
      .replace(/\u00dc/g, "Ue")
      .replace(/\W/g, "");
}

export type VariableType<TZodType extends z.ZodType> = z.infer<TZodType>;
