import { z } from "zod";
import { NodePlugin } from "@open-decision/plugins-node-helpers";

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
}

export type TPlaceholderNode = z.infer<PlaceholderNodePlugin["Type"]>;
