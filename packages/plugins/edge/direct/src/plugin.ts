import {
  EdgePlugin,
  EdgePluginBaseType,
  EntityPluginType,
} from "@open-decision/tree-type";
import { z } from "zod";

export const typeName = "direct" as const;

const DataType = z.object({});

export const DirectEdgePluginType = EdgePluginBaseType(typeName, DataType);

export type TDirectEdge = EntityPluginType<typeof DirectEdgePluginType>;

export class DirectEdgePlugin extends EdgePlugin<TDirectEdge> {
  constructor() {
    super(typeName, DirectEdgePluginType);
  }
}
