import { IInputPlugin, InputPlugin } from "../../helpers";
import { updateRequired } from "../../helpers/utils/inputMethods";

export const typeName = "text" as const;

export interface ITextInput extends IInputPlugin<typeof typeName> {
  required: boolean;
}

export class TextInputPlugin extends InputPlugin<ITextInput> {
  constructor() {
    super(typeName);
  }

  create = ({
    required = false,
    label,
    ...data
  }: Partial<Omit<ITextInput, "id" | "type">>) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      required,
      label: label ? label : `Textfeld`,
      ...data,
    } satisfies ITextInput;
  };
  updateRequired = updateRequired<ITextInput>();
}
