import {
  IReadableVariablePlugin,
  IVariablePlugin,
  VariablePlugin,
} from "@open-decision/tree-type";

const typeName = "select";

export interface ISelectVariable extends IVariablePlugin<typeof typeName> {
  values: { id: string; value?: string }[];
  value?: string;
}

export interface IReadableSelectVariable
  extends IReadableVariablePlugin<typeof typeName> {
  values: { id: string; value?: string }[];
  value?: string;
}

export class SelectVariablePlugin extends VariablePlugin<ISelectVariable> {
  constructor() {
    super(typeName);
  }

  create = (
    data: Partial<Omit<ISelectVariable, "type">> & Pick<ISelectVariable, "id">
  ) => {
    return {
      type: this.type,
      values: [],
      ...data,
    } satisfies ISelectVariable;
  };

  createReadable = (variable: ISelectVariable) => {
    if (!variable.name) return undefined;

    const readableValue = variable.values.find((v) => v.id === variable.value);

    if (!readableValue) return undefined;

    return {
      ...variable,
      id: this.createReadableKey(variable.name),
      value: readableValue.value,
    } satisfies IReadableSelectVariable;
  };
}
