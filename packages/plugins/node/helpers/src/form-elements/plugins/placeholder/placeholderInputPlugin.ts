import { z } from "zod";
import { IInputPlugin, InputPlugin } from "../../helpers";

export const typeName = "placeholder";

export const DataType = z.object({});

export type IPlaceholderInput = IInputPlugin<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class PlaceholderInputPlugin extends InputPlugin<IPlaceholderInput> {
  constructor() {
    super(typeName);
  }
}
