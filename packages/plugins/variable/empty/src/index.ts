import { IVariablePlugin, VariablePlugin } from "@open-decision/tree-type";

const typeName = "empty";

export interface IEmptyVariable extends IVariablePlugin<typeof typeName> {
  value: undefined;
}

export class EmptyVariablePlugin extends VariablePlugin<IEmptyVariable> {
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
}
