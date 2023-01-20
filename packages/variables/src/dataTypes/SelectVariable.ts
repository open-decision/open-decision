import { IBaseVariable, BaseVariable } from "../Variable";
import { TId } from "@open-decision/tree-id";

const typeName = "select";

export interface ISelectVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  values: { id: string; value?: string }[];
  value?: string;
  readableValue?: string;
}

class CSelectVariable extends BaseVariable<ISelectVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    values = [],
    value = "",
    ...data
  }: Omit<ISelectVariable<Id>, "type" | "escapedName" | "readableValue">) => {
    return {
      type: this.type,
      values,
      value,
      escapedName: this.createReadableKey(data.name),
      readableValue: values.find((possibleValue) => possibleValue.id === value)
        ?.value,
      ...data,
    } satisfies ISelectVariable;
  };
}

export const SelectVariable = new CSelectVariable();
