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

  createReadableKey = (key: string) =>
    key
      .split(" ")
      .join("_")
      .replace(/\u00df/g, "ss")
      .replace(/\u00e4/g, "ae")
      .replace(/\u00f6/g, "oe")
      .replace(/\u00fc/g, "ue")
      .replace(/\u00c4/g, "Ae")
      .replace(/\u00d6/g, "Oe")
      .replace(/\u00dc/g, "Ue")
      .replace(/\W/g, "");
}
