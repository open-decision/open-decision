import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";
import { z } from "zod";

const typeName = "select";

const Value = z.object({ id: z.string().uuid(), value: z.string() });

const DataType = z.object({
  values: z.array(Value),
  value: z.string().optional(),
});

export const SelectVariableType = VariablePluginBaseType(typeName, DataType);

export type TSelectVariable = VariableType<typeof SelectVariableType>;

export class SelectVariablePlugin extends VariablePlugin<
  TSelectVariable,
  typeof SelectVariableType
> {
  constructor() {
    super(typeName, SelectVariableType);
  }

  create = (
    data: Partial<Omit<TSelectVariable, "type">> & Pick<TSelectVariable, "id">
  ) => {
    return {
      type: this.type,
      values: [],
      ...data,
    } satisfies TSelectVariable;
  };
}
