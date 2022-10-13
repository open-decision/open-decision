import { z } from "zod";
import * as Condition from "./Condition";
import * as Edge from "./Edge";
import * as Node from "./Node";

export const Type = z.object({
  startNode: z.string(),
  nodes: Node.Record.optional(),
  edges: Edge.Record.optional(),
  conditions: Condition.Record.optional(),
  pluginEntities: z.any().optional(),
});

export type TTree = z.infer<typeof Type>;
