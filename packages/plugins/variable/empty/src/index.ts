import {
  IVariablePlugin,
  VariablePlugin,
  IReadableVariablePlugin,
} from "@open-decision/tree-type";

const typeName = "empty";

export interface IEmptyVariable extends IVariablePlugin<typeof typeName> {
  value: undefined;
}

export interface IReadableEmptyVariable extends IReadableVariablePlugin {
  value: undefined;
}

export class EmptyVariablePlugin extends VariablePlugin<
  IEmptyVariable,
  IReadableEmptyVariable
> {
  constructor() {
    super(typeName);
  }

  create = (
    data: Partial<Omit<IEmptyVariable, "type">> & Pick<IEmptyVariable, "id">
  ) => {
    return {
      type: this.type,
      value: undefined,
      ...data,
    } satisfies IEmptyVariable;
  };

  createReadable = (variable: IEmptyVariable) => {
    if (!variable.name) return;

    return {
      ...variable,
      id: this.createReadableKey(variable.name),
    };
  };
}
