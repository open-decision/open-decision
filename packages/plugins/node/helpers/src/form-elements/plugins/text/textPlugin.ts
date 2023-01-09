import { z } from "zod";
import { TextVariablePlugin } from "@open-decision/plugins-variable-text";
import { createFn, InputPlugin } from "../../helpers";
import { updateRequired } from "../../helpers/utils/inputMethods";

export const typeName = "text" as const;

export const DataType = z.object({ required: z.boolean() });

export type TTextInput = z.infer<TextInputPlugin["Type"]>;
const TextVariable = new TextVariablePlugin();

export class TextInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof TextVariable
> {
  constructor() {
    super(DataType, typeName, TextVariable);

    this.defaultData = { required: false };
  }

  create: createFn<typeof this.Type> = (data) => {
    const newInput = {
      id: crypto.randomUUID(),
      type: this.type,
      required: false,
      ...data,
      data: { ...this.defaultData, ...data?.data },
    };

    return this.parse(newInput);
  };

  updateRequired = updateRequired(this.Type);
}
