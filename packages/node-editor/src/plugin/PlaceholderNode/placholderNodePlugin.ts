import { INodePlugin, NodePlugin } from "@open-decision/tree-type";
import { z } from "zod";
import { createFn, NodePlugin } from "@open-decision/plugins-node-helpers";

export const typeName = "placeholder" as const;
export const DataType = z.object({});

export type IPlaceholderNode = INodePlugin<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class PlaceholderNodePlugin extends NodePlugin<IPlaceholderNode> {
  constructor() {
    super(typeName);

    this.isAddable = false;
  }

  create: createFn<typeof this.Type> =
    ({ data, ...rest }) =>
    (treeClient) => {
      const newNode = treeClient.nodes.create.node({
        type: this.typeName,
        data: { ...this.defaultData, ...data },
        ...rest,
      });

      return this.Type.parse(newNode);
    };
}
