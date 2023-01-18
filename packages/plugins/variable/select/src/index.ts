import { IVariablePlugin, TId, VariablePlugin } from "@open-decision/tree-type";

const typeName = "select";

export interface ISelectVariable<Id extends TId = TId>
  extends IVariablePlugin<typeof typeName, Id> {
  values: { id: string; value?: string }[];
  value?: string;
  readableValue?: string;
}

export class SelectVariablePlugin extends VariablePlugin<ISelectVariable> {
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
