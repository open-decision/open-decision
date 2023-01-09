import { z } from "zod";
import * as Edge from "./Edge";
import * as Node from "./Node";
import { Theme } from "./Theme";

export const Type = z.object({
  startNode: z.string(),
  nodes: Node.Record<string>("undetermined", z.any()),
  edges: Edge.Record<string>("undetermined", z.any()),
  pluginEntities: z.record(z.any()),
  uuid: z.string().uuid().optional(),
  theme: Theme.optional(),
});

export type TTree = z.infer<typeof Type>;
