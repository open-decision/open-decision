import { NodePlugin, INode, createFn } from "@open-decision/tree-type";

export const typeName = "placeholder" as const;

export type IPlaceholderNode = INode<typeof typeName>;

export class PlaceholderNodePlugin extends NodePlugin<IPlaceholderNode> {
  constructor() {
    super(typeName);

    this.isAddable = false;
  }

  create: createFn<IPlaceholderNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IPlaceholderNode>({
      type: this.type,
      ...data,
    });
  };
}
