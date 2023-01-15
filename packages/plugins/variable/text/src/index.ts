import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";
import { z } from "zod";

const typeName = "text";

const DataType = z.object({
  value: z.string().optional(),
});

export const TextVariableType = VariablePluginBaseType(typeName, DataType);

export type TTextVariable = VariableType<typeof TextVariableType>;

export class TextVariablePlugin extends VariablePlugin<
  TTextVariable,
  typeof TextVariableType
> {
  constructor() {
    super(typeName, TextVariableType);
  }

  create = (
    data: Partial<Omit<TTextVariable, "type">> & Pick<TTextVariable, "id">
  ) => {
    return {
      type: this.type,
      ...data,
    } satisfies TTextVariable;
  };
}
