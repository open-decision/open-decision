import { TId } from "@open-decision/tree-ids";
import { IBaseVariable, BaseVariable } from "../Variable";

const typeName = "empty";

export interface IEmptyVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value: undefined;
  readableValue: undefined;
}

class CEmptyVariable extends BaseVariable<IEmptyVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>(
    data: Omit<
      IEmptyVariable<Id>,
      "type" | "escapedName" | "value" | "readableValue"
    >
  ) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      value: undefined,
      readableValue: undefined,
      ...data,
    } satisfies IEmptyVariable;
  };
}

export const EmptyVariable = new CEmptyVariable();