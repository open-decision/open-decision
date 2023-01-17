import { IVariablePlugin, VariablePlugin } from "@open-decision/tree-type";

const typeName = "select";

export interface ISelectVariable extends IVariablePlugin<typeof typeName> {
  values: { id: string; value?: string }[];
  value?: string;
}

export interface IReadableSelectVariable
  extends IVariablePlugin<typeof typeName> {
  values: { id: string; value?: string }[];
  value?: string;
}

export class SelectVariablePlugin extends VariablePlugin<ISelectVariable> {
  constructor() {
    super(typeName);
  }

  create = (
    data: Partial<Omit<ISelectVariable, "type">> &
      Pick<ISelectVariable, "id" | "name">
  ) => {
    return {
      type: this.type,
      values: [],
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
