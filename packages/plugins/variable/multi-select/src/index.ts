import { IVariablePlugin, TId, VariablePlugin } from "@open-decision/tree-type";

const typeName = "multi-select";

export interface IMultiSelectVariable<Id extends TId = TId>
  extends IVariablePlugin<typeof typeName> {
  id: Id;
  values: { id: string; value?: string }[];
  value?: string[];
  readableValue?: string[];
}

export class MultiSelectVariablePlugin extends VariablePlugin<IMultiSelectVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    values = [],
    value = [],
    ...data
  }: Omit<
    IMultiSelectVariable<Id>,
    "type" | "escapedName" | "readableValue"
  >) => {
    return {
      type: this.type,
      values,
      escapedName: this.createReadableKey(data.name),
      value,
      readableValue: value
        ?.map((valueId) => values.find((value) => value.id === valueId)?.value)
        .filter((value): value is string => value !== undefined),
      ...data,
    } satisfies IMultiSelectVariable;
  };
}
