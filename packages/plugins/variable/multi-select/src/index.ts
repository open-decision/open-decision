import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";
import { z } from "zod";

const typeName = "multi-select-variable";

const Value = z.object({ id: z.string().uuid(), value: z.string() });

const DataType = z.object({
  values: z.array(Value),
  value: z.array(z.string()).optional(),
});

export const MultiSelectVariableType = VariablePluginBaseType(
  typeName,
  DataType
);

export type IMultiSelectVariable = VariableType<typeof MultiSelectVariableType>;

export class MultiSelectVariablePlugin extends VariablePlugin<IMultiSelectVariable> {
  constructor() {
    super(typeName, MultiSelectVariableType);
  }
}
