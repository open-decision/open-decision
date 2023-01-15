import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";
import { z } from "zod";
import { TextVariableType } from "@open-decision/plugins-variable-text";
import { SelectVariableType } from "@open-decision/plugins-variable-select";
import { ListVariableType } from "@open-decision/plugins-variable-list";
import { EmptyVariableType } from "@open-decision/plugins-variable-empty";

const RecordContentType = z.discriminatedUnion("type", [
  TextVariableType,
  SelectVariableType,
  ListVariableType,
  EmptyVariableType,
]);

const typeName = "record";

const DataType = z.object({
  value: z.record(RecordContentType).optional(),
});

export const RecordVariableType = VariablePluginBaseType(typeName, DataType);

export type TRecordVariable = VariableType<typeof RecordVariableType>;

export class RecordVariablePlugin extends VariablePlugin<
  TRecordVariable,
  typeof RecordVariableType
> {
  constructor() {
    super(typeName, RecordVariableType);
  }

  create = (
    data: Partial<Omit<TRecordVariable, "type">> & Pick<TRecordVariable, "id">
  ) => {
    return {
      type: this.type,
      ...data,
    } satisfies TRecordVariable;
  };
}
