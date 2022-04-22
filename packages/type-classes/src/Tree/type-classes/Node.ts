import { z } from "zod";

export const Coordinates = z.object({ x: z.number(), y: z.number() });

export const Type = z.object({
  id: z.string().uuid(),
  position: Coordinates,
  type: z.literal("customNode"),
  data: z.object({
    name: z.string().optional(),
    content: z.any(),
    inputs: z.array(z.string()),
    conditions: z.array(z.string()),
  }),
});

export const Record = z.record(Type);

// ------------------------------------------------------------------
// Types

export type TNode = z.infer<typeof Type>;
export type TNodesRecord = z.infer<typeof Record>;
export type TNodeData = TNode["data"];
export type TCoordinates = z.infer<typeof Coordinates>;
