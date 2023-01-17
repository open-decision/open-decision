import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { createDefaultName } from "../../../utils/createDefaultName";
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

  create =
    ({
      required = false,
      name,
      ...data
    }: Partial<Omit<ITextInput, "id" | "type">>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: `input_${crypto.randomUUID()}`,
        type: this.type,
        required,
        name: name ? name : createDefaultName(treeClient),
        ...data,
      } satisfies ITextInput;
    };
  updateRequired = updateRequired<ITextInput>();
}
