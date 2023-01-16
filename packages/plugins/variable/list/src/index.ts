import { IVariablePlugin, VariablePlugin } from "@open-decision/tree-type";

const typeName = "list";

export interface IListVariable extends IVariablePlugin<typeof typeName> {
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
}
