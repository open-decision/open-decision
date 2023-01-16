import { IVariablePlugin, VariablePlugin } from "@open-decision/tree-type";

const typeName = "select";

export interface ISelectVariable extends IVariablePlugin<typeof typeName> {
  values: { id: string; value: string }[];
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
}
