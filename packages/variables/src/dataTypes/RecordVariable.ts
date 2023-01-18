import { TId } from "@open-decision/tree-type";
import { IBaseVariable, BaseVariable } from "../Variable";
import { IEmptyVariable } from "./EmptyVariable";
import { IMultiSelectVariable } from "./MultiSelectVariable";
import { ISelectVariable } from "./SelectVariable";
import { ITextVariable } from "./TextVariable";

const typeName = "record";

type TRecordContent =
  | ITextVariable
  | ISelectVariable
  | IMultiSelectVariable
  | IEmptyVariable;

export interface IRecordVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value?: Record<string, TRecordContent>;
}

export class RecordVariable extends BaseVariable<IRecordVariable> {
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
}
