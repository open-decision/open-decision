import { z } from "zod";
import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";

const DataType = z.object({ value: z.undefined() });

const typeName = "empty";

export type TEmptyVariable = VariableType<typeof EmptyVariableType>;

export const EmptyVariableType = VariablePluginBaseType(typeName, DataType);

export class EmptyVariablePlugin extends VariablePlugin<
  TEmptyVariable,
  typeof EmptyVariableType
> {
  constructor() {
    super(typeName, EmptyVariableType);
  }

  create = (
    data: Partial<Omit<TEmptyVariable, "type">> & Pick<TEmptyVariable, "id">
  ) => {
    return {
      type: this.type,
      value: undefined,
      ...data,
    } satisfies TEmptyVariable;
  };
}
