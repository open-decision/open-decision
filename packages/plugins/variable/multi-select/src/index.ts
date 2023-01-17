import { IVariablePlugin, TId, VariablePlugin } from "@open-decision/tree-type";

const typeName = "multi-select";

export interface IMultiSelectVariable<Id extends TId = TId>
  extends IVariablePlugin<typeof typeName> {
  id: Id;
  values: { id: string; value?: string }[];
  value?: string[];
}

export class MultiSelectVariablePlugin extends VariablePlugin<IMultiSelectVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TId = TId>({
    values = [],
    ...data
  }: Omit<IMultiSelectVariable<Id>, "type" | "escapedName">) => {
    return {
      type: this.type,
      values,
      escapedName: this.createReadableKey(data.name),
      ...data,
    } satisfies IMultiSelectVariable;
  };
}
