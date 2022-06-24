import { z } from "zod";
import * as Condition from "./Condition";
import * as Edge from "./Edge";
import * as Input from "./Input";
import * as Node from "./Node";

export const Type = z.object({
  startNode: z.string().optional(),
  nodes: Node.Record.optional(),
  edges: Edge.Record.optional(),
  inputs: Input.Record.optional(),
  conditions: Condition.Record.optional(),
});

export type TTree = z.infer<typeof Type>;
