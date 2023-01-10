import { z } from "zod";
import { IInputPlugin, InputPlugin } from "../../helpers";
import { updateRequired } from "../../helpers/utils/inputMethods";

export const typeName = "text" as const;

export const DataType = z.object({ required: z.boolean() });

export type ITextInput = IInputPlugin<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class TextInputPlugin extends InputPlugin<ITextInput> {
  constructor() {
    super(typeName, { required: false });

    this.defaultData = { required: false };
  }

  updateRequired = updateRequired<ITextInput>();
}
