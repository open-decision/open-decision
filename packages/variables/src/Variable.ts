import { TId } from "@open-decision/tree-type";
import { z } from "zod";

export const ZVariablePlugin = z.object({
  id: z.string().uuid(),
  type: z.string(),
  name: z.string().optional(),
  value: z.any().optional(),
});

export type TValueId = `value_${string}`;
export interface IBaseVariable<
  TType extends string = string,
  Id extends TId = TId
> {
  id: Id;
  type: TType;
  name: string;
  escapedName: string;
}

export abstract class BaseVariable<
  TType extends IBaseVariable = IBaseVariable
> {
  pluginType = "variable" as const;
  type: TType["type"];

  constructor(type: TType["type"]) {
    this.type = type;
  }

  abstract create: (
    data: Omit<TType, "type" | "escapedName" | "readableValue">
  ) => TType | undefined;

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
