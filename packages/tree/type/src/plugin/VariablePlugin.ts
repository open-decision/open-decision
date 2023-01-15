import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";
import { TNodePlugin } from "./NodePlugin";

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
    name: z.string().optional(),
  });

export type TVariablePluginBase<
  TType extends string = string,
  TData = any
> = z.infer<ReturnType<typeof VariablePluginBaseType<TType, z.ZodType<TData>>>>;

export abstract class VariablePlugin<
  TType extends TVariablePluginBase = TVariablePluginBase,
  TZodType extends z.AnyZodObject = z.AnyZodObject
> {
  pluginType = "variable" as const;
  type: TType["type"];
  declare Type: TZodType;
  declare defaultData: TType["data"];

  constructor(
    type: TType["type"],
    Type: TZodType,
    defaultData: TType["data"] = {}
  ) {
    this.type = type;
    this.Type = Type;
    this.defaultData = defaultData;
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

  create = (node: TNodePlugin, data: TType["data"], readable = false) => {
    const variable = {
      id: node.id,
      type: this.type,
      name: node.name,
      data: { ...this.defaultData, ...data },
    };

    if (readable) {
      if (!node.name)
        return new ODProgrammerError({
          code: "MISSING_NAME",
          message:
            "You cannot create a readable variable when the node does not have a name.",
        });

      return [this.createReadableKey(node.name), variable] as const;
    }

    return [node.id, variable] as const;
  };

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
