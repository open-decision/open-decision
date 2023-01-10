import { IVariablePluginBase, VariablePlugin } from "@open-decision/tree-type";

const typeName = "single-select-variable";

export type ISelectVariable = IVariablePluginBase<
  typeof typeName,
  { values: { id: string; value: string }[]; value?: string }
>;

export class SingleSelectVariablePlugin extends VariablePlugin<ISelectVariable> {
  constructor() {
    super(typeName);
  }
}
