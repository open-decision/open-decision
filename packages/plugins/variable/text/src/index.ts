import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";
import { z } from "zod";

const typeName = "text-variable";

const DataType = z.object({
  value: z.string().optional(),
});

export const TextVariablePluginType = VariablePluginBaseType(
  typeName,
  DataType
);
export type TTextVariable = VariableType<typeof TextVariablePluginType>;

export class TextVariablePlugin extends VariablePlugin<
  TTextVariable,
  typeof TextVariablePluginType
> {
  constructor() {
    super(typeName, TextVariablePluginType, {});
  }
}
