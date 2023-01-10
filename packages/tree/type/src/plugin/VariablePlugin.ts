export interface IVariablePluginBase<
  TType extends string = string,
  TData = any
> {
  type: TType;
  data: TData;
  name: string;
}

export abstract class VariablePlugin<
  TType extends IVariablePluginBase = IVariablePluginBase
> {
  pluginType = "variable" as const;
  type: TType["type"];

  constructor(type: TType["type"]) {
    this.type = type;
  }
}
