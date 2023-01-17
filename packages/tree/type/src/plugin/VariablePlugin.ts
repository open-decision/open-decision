import { z } from "zod";
import { TId } from "./EntityPlugin";

export const ZVariablePlugin = z.object({
  id: z.string().uuid(),
  type: z.string(),
  name: z.string().optional(),
  value: z.any().optional(),
});

export type TValueId = `value_${string}`;
export interface IVariablePlugin<TType extends string = string> {
  id: TId;
  type: TType;
  name: string;
  escapedName: string;
  value?: any;
}

export abstract class VariablePlugin<
  TType extends IVariablePlugin = IVariablePlugin
> {
  pluginType = "variable" as const;
  type: TType["type"];

  constructor(type: TType["type"]) {
    this.type = type;
  }

  get = (id: string, answers: any) => {
    return answers[id] as TType | undefined;
  };
  abstract create: (
    data: Partial<Omit<TType, "type" | "id" | "name">> &
      Required<Pick<TType, "id" | "name">>
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
