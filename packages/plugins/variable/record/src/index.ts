import { IEmptyVariable } from "@open-decision/plugins-variable-empty";
import { IListVariable } from "@open-decision/plugins-variable-list";
import { ISelectVariable } from "@open-decision/plugins-variable-select";
import { ITextVariable } from "@open-decision/plugins-variable-text";
import { IVariablePlugin, VariablePlugin } from "@open-decision/tree-type";

const typeName = "record";

type TRecordContent =
  | ITextVariable
  | ISelectVariable
  | IListVariable
  | IEmptyVariable;

export interface TRecordVariable extends IVariablePlugin<typeof typeName> {
  value?: Record<string, TRecordContent>;
}

export class RecordVariablePlugin extends VariablePlugin<TRecordVariable> {
  constructor() {
    super(typeName);
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
