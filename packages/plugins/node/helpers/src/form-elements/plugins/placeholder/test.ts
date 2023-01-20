import { IInputPlugin, InputPlugin } from "../../helpers";

export const typeName = "placeholder";

export type IPlaceholderInput = IInputPlugin<typeof typeName>;

export class PlaceholderInputPlugin extends InputPlugin<IPlaceholderInput> {
  constructor() {
    super(typeName);
  }

  create = ({
    label,
    ...data
  }: Partial<Omit<IPlaceholderInput, "id" | "type">>) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      label: label ? label : `Platzhalter`,
      ...data,
    } satisfies IPlaceholderInput;
  };
}
