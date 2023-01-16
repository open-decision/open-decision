import { IVariablePlugin, VariablePlugin } from "@open-decision/tree-type";

const typeName = "text";

export interface ITextVariable extends IVariablePlugin<typeof typeName> {
  value?: string;
}

export class TextVariablePlugin extends VariablePlugin<ITextVariable> {
  constructor() {
    super(typeName);
  }

  create = (
    data: Partial<Omit<ITextVariable, "type">> & Pick<ITextVariable, "id">
  ) => {
    return {
      type: this.type,
      ...data,
    } satisfies ITextVariable;
  };
}
