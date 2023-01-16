import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { IInputPlugin, InputPlugin } from "../../helpers";

export const typeName = "placeholder";

export type IPlaceholderInput = IInputPlugin<typeof typeName>;

export class PlaceholderInputPlugin extends InputPlugin<IPlaceholderInput> {
  constructor() {
    super(typeName);
  }

  create =
    (data: Partial<Omit<IPlaceholderInput, "id" | "type">>) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: `input_${crypto.randomUUID()}`,
        type: this.type,
        ...data,
      } satisfies IPlaceholderInput;
    };
}
