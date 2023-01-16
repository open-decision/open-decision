import {
  IReadableVariablePlugin,
  IVariablePlugin,
  VariablePlugin,
} from "@open-decision/tree-type";

const typeName = "text";

export interface ITextVariable extends IVariablePlugin<typeof typeName> {
  value?: string;
}

export interface IReadableTextVariable extends IReadableVariablePlugin {
  value?: string;
}

export class TextVariablePlugin extends VariablePlugin<
  ITextVariable,
  IReadableTextVariable
> {
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

  createReadable = (variable: ITextVariable) => {
    if (!variable.name) return;

    return { ...variable, id: this.createReadableKey(variable.name) };
  };
}
