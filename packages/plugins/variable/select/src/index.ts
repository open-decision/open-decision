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

export const SingleSelectVariableType = VariablePluginBaseType(
  typeName,
  DataType
);

export type ISelectVariable = VariableType<typeof SingleSelectVariableType>;

export class SingleSelectVariablePlugin extends VariablePlugin<ISelectVariable> {
  constructor() {
    super(typeName, SingleSelectVariableType);
  }
}
