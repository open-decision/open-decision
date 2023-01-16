import {
  IReadableVariablePlugin,
  IVariablePlugin,
  VariablePlugin,
} from "@open-decision/tree-type";

const typeName = "multi-select";

export interface IMultiSelectVariable extends IVariablePlugin<typeof typeName> {
  values: { id: string; value?: string }[];
  value?: string[];
}

export interface IReadableMultiSelectVariable extends IReadableVariablePlugin {
  values: { id: string; value: string }[];
  value?: string[];
}

export class MultiSelectVariablePlugin extends VariablePlugin<
  IMultiSelectVariable,
  IReadableMultiSelectVariable
> {
  constructor() {
    super(typeName);
  }

  create = (
    data: Partial<Omit<IMultiSelectVariable, "type">> &
      Pick<IMultiSelectVariable, "id">
  ) => {
    return {
      type: this.type,
      values: [],
      ...data,
    } satisfies IMultiSelectVariable;
  };

  createReadable = (variable: IMultiSelectVariable) => {
    const readbableValue = variable.value
      ?.map(
        (selectedValue) =>
          variable.values.find(
            (possibleValue) => possibleValue.id === selectedValue
          )?.value
      )
      .filter((value): value is string => value !== undefined);

    if (!readbableValue || !variable.name) return;

    return {
      ...variable,
      id: this.createReadableKey(variable.name),
      value: readbableValue,
    } satisfies IReadableMultiSelectVariable;
  };
}
