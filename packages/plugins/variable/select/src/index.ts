import { IVariablePlugin, TId, VariablePlugin } from "@open-decision/tree-type";

const typeName = "select";

export interface ISelectVariable<Id extends TId = TId>
  extends IVariablePlugin<typeof typeName, Id> {
  values: { id: string; value?: string }[];
  value?: string;
}

export class SelectVariablePlugin extends VariablePlugin<ISelectVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    values = [],
    ...data
  }: Omit<ISelectVariable<Id>, "type" | "escapedName">) => {
    return {
      type: this.type,
      values,
      escapedName: this.createReadableKey(data.name),
      ...data,
    } satisfies ISelectVariable;
  };

  addValue = (variable: ISelectVariable, valueId: string) => {
    const value = variable.values.find(
      (possibleAnswer) => possibleAnswer.id === valueId
    )?.value;

    if (!value) return;

    return {
      ...variable,
      value,
    } satisfies ISelectVariable;
  };
}
