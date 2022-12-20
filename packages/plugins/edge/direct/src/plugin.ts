import { EdgePlugin } from "@open-decision/plugins-edge-helpers";
import { z } from "zod";

export const typeName = "direct" as const;

export const DataType = z.void();

export class DirectEdgePlugin extends EdgePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor() {
    super(DataType, typeName);
  }
}

export type TDirectEdge = z.infer<DirectEdgePlugin["Type"]>;
