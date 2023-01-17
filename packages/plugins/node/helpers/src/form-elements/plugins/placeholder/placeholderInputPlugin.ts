import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { createDefaultName } from "../../../utils/createDefaultName";
import { IInputPlugin, InputPlugin } from "../../helpers";

export const typeName = "placeholder";

export type IPlaceholderInput = IInputPlugin<typeof typeName>;

export class PlaceholderInputPlugin extends InputPlugin<IPlaceholderInput> {
  constructor() {
    super(typeName);
  }

  create =
    ({ name, ...data }: Partial<Omit<IPlaceholderInput, "id" | "type">>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: `input_${crypto.randomUUID()}`,
        type: this.type,
        name: name ? name : createDefaultName(treeClient),
        ...data,
      } satisfies IPlaceholderInput;
    };
}
