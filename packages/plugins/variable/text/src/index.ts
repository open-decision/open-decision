import { IVariablePlugin, TId, VariablePlugin } from "@open-decision/tree-type";

const typeName = "text";

export interface ITextVariable<Id extends TId = TId>
  extends IVariablePlugin<typeof typeName, Id> {
  value?: string;
}

export class TextVariablePlugin extends VariablePlugin<ITextVariable> {
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
