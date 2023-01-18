import { TId } from "@open-decision/tree-type";
import { IVariable } from "..";
import { IBaseVariable, BaseVariable } from "../Variable";

const typeName = "record";

export interface IRecordVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value: Record<string, IVariable>;
}

class CRecordVariable extends BaseVariable<IRecordVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    value = {},
    ...data
  }: Omit<IRecordVariable<Id>, "type" | "escapedName" | "value"> &
    Partial<Pick<IRecordVariable, "value">>) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      value,
      ...data,
    } satisfies IRecordVariable;
  };
}

export const RecordVariable = new CRecordVariable();
