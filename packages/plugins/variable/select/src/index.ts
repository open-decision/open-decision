import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";
import { z } from "zod";

const typeName = "single-select-variable";

const Value = z.object({ id: z.string().uuid(), value: z.string() });

const DataType = z.object({
  values: z.array(Value),
  value: z.string().optional(),
});

export const SelectVariablePluginType = VariablePluginBaseType(
  typeName,
  DataType
);

export type TSelectVariable = VariableType<typeof SelectVariablePluginType>;

export class SelectVariablePlugin extends VariablePlugin<
  TSelectVariable,
  typeof SelectVariablePluginType
> {
  constructor() {
    super(typeName, SelectVariablePluginType, { values: [] });
  }
}
