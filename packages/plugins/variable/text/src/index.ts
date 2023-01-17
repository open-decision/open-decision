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

  create = <Id extends TId = TId>(
    data: Omit<ITextVariable<Id>, "type" | "escapedName">
  ) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey(data.name),
      ...data,
    } satisfies ITextVariable;
  };
}
