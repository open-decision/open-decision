import { z } from "zod";
import { createFn, NodePlugin } from "@open-decision/plugins-node-helpers";

export const typeName = "placeholder" as const;
export const DataType = z.object({});

export class PlaceholderNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor() {
    super(DataType, typeName);

    this.defaultData = {};
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

export type TPlaceholderNode = z.infer<PlaceholderNodePlugin["Type"]>;
