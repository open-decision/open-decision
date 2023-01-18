import { TId } from "@open-decision/tree-type";
import { IBaseVariable, BaseVariable } from "../Variable";

const typeName = "text";

export interface ITextVariable<Id extends TId = TId>
  extends IBaseVariable<typeof typeName, Id> {
  value?: string;
}

export class TextVariable extends BaseVariable<ITextVariable> {
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
