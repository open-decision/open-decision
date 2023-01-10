import { IVariablePluginBase, VariablePlugin } from "@open-decision/tree-type";

const typeName = "text-variable";

export type ITextVariable = IVariablePluginBase<
  typeof typeName,
  { value?: string }
>;

export class TextVariablePlugin extends VariablePlugin<ITextVariable> {
  constructor() {
    super(typeName);
  }
}
