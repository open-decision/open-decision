import { TId } from "@open-decision/tree-ids";
import { IBaseVariable, BaseVariable } from "../Variable";

const typeName = "text";

export interface ITextVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value?: string;
  readableValue?: string;
}

class CTextVariable extends BaseVariable<ITextVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    value = "",
    ...data
  }: Omit<ITextVariable<Id>, "type" | "escapedName" | "readableValue">) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      value,
      readableValue: value,
      ...data,
    } satisfies ITextVariable;
  };
}

export const TextVariable = new CTextVariable();
