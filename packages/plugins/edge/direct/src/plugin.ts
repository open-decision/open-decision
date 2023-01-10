import { IEdgePlugin, EdgePlugin } from "@open-decision/tree-type";
import { z } from "zod";

export const typeName = "direct" as const;

export const DataType = z.undefined();

export type IDirectEdge = IEdgePlugin<typeof typeName, undefined>;

export class DirectEdgePlugin extends EdgePlugin<IDirectEdge> {
  constructor() {
    super(typeName);
  }
}
