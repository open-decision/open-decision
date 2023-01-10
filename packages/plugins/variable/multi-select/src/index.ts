import { VariablePlugin, IVariablePluginBase } from "@open-decision/tree-type";

const typeName = "multi-select-variable";

export type IMultiSelectVariable = IVariablePluginBase<
  typeof typeName,
  { values: { id: string; value: string }[]; value?: string[] }
>;

export class MultiSelectVariablePlugin extends VariablePlugin<IMultiSelectVariable> {
  constructor() {
    super(typeName);
  }
}
