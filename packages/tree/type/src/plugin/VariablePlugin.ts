export interface IVariablePlugin<TType extends string = string> {
  id: string;
  type: TType;
  name?: string;
}

export abstract class VariablePlugin<
  TType extends IVariablePlugin = IVariablePlugin
> {
  pluginType = "variable" as const;
  type: TType["type"];

  constructor(type: TType["type"]) {
    this.type = type;
  }

  get = (id: string, answers: any) => {
    return answers[id] as TType | undefined;
  };
  abstract create: (
    data: Partial<Omit<TType, "type">> & Pick<TType, "id">
  ) => TType;
}
