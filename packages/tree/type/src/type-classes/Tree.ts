import { z } from "zod";
import * as Edge from "./Edge";
import * as Node from "./Node";

export const Type = z.object({
  startNode: z.string(),
  nodes: Node.Record,
  edges: Edge.Record,
  pluginEntities: z.record(z.any()),
});

export type TTree = z.infer<typeof Type>;
