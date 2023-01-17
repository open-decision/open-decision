import {
  IEmptyVariable,
} from "@open-decision/plugins-variable-empty";
import {
  IMultiSelectVariable,
} from "@open-decision/plugins-variable-multi-select";
import {
  ISelectVariable,
} from "@open-decision/plugins-variable-select";
import {
  ITextVariable,
} from "@open-decision/plugins-variable-text";
import {
  IVariablePlugin,
  TId,
  VariablePlugin,
} from "@open-decision/tree-type";

const typeName = "record";

type TRecordContent =
  | ITextVariable
  | ISelectVariable
  | IMultiSelectVariable
  | IEmptyVariable;



export interface IRecordVariable<Id extends TId = TId>
  extends IVariablePlugin<typeof typeName, Id> {
  value?: Record<string, TRecordContent>;
}

export class RecordVariablePlugin extends VariablePlugin<IRecordVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>(
    data: Omit<IRecordVariable<Id>, "type" | "escapedName">
  ) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      ...data,
    } satisfies IRecordVariable;
  };


