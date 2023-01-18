import { IBaseVariable, BaseVariable } from "../Variable";

import { TId } from "@open-decision/tree-type";

const typeName = "empty";

export interface IEmptyVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value: undefined;
}

export class EmptyVariable extends BaseVariable<IEmptyVariable> {
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
