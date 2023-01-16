import {
  IReadableVariablePlugin,
  IVariablePlugin,
  VariablePlugin,
} from "@open-decision/tree-type";

const typeName = "list";

export interface IListVariable extends IVariablePlugin<typeof typeName> {
  values: { id: string; value: string }[];
  value?: string[];
}

export interface IReadableListVariable
  extends IReadableVariablePlugin<IListVariable> {
  values: { id: string; value: string }[];
  value?: string[];
}

export class ListVariablePlugin extends VariablePlugin<IListVariable> {
  constructor() {
    super(typeName);
  }

  create = (
    data: Partial<Omit<IListVariable, "type">> & Pick<IListVariable, "id">
  ) => {
    return {
      type: this.type,
      values: [],
      ...data,
    } satisfies IListVariable;
  };

  createReadable = (variable: IListVariable) => {
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
    } satisfies IReadableListVariable;
  };
}
