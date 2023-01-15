import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";
import { z } from "zod";

const typeName = "list";

const Value = z.object({ id: z.string().uuid(), value: z.string() });

const DataType = z.object({
  values: z.array(Value).optional(),
  value: z.array(z.string()).optional(),
});

export const ListVariableType = VariablePluginBaseType(typeName, DataType);

export type TListVariable = VariableType<typeof ListVariableType>;

export class ListVariablePlugin extends VariablePlugin<
  TListVariable,
  typeof ListVariableType
> {
  constructor() {
    super(typeName, ListVariableType);
  }

  create = (
    data: Partial<Omit<TListVariable, "type">> & Pick<TListVariable, "id">
  ) => {
    return {
      type: this.type,
      ...data,
    } satisfies TListVariable;
  };
}
