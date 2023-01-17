import {
  NodePlugin,
  INodePlugin,
  TTreeClient,
  TReadOnlyTreeClient,
} from "@open-decision/tree-type";

export const typeName = "placeholder" as const;

export type IPlaceholderNode = INodePlugin<typeof typeName>;

export class PlaceholderNodePlugin extends NodePlugin<IPlaceholderNode> {
  constructor() {
    super(typeName);

    this.isAddable = false;
  }

  create =
    ({
      position = { x: 0, y: 0 },
      ...data
    }: Partial<Omit<IPlaceholderNode, "id" | "type">>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return treeClient.nodes.create.node<IPlaceholderNode>({
        type: this.type,
        position,
        ...data,
      });
    };
}
