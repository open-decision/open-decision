import {
  NodePlugin,
  EntityPluginType,
  NodePluginBaseType,
} from "@open-decision/tree-type";
import { z } from "zod";

export const typeName = "placeholder" as const;
const DataType = z.object({});

export const PlaceholderNodePluginType = NodePluginBaseType(typeName, DataType);

export type IPlaceholderNode = EntityPluginType<
  typeof PlaceholderNodePluginType
>;

export class PlaceholderNodePlugin extends NodePlugin<IPlaceholderNode> {
  constructor() {
    super(typeName, PlaceholderNodePluginType, {});

    this.isAddable = false;
  }
}
