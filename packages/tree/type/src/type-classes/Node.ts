import { z } from "zod";

export const Coordinates = z.object({ x: z.number(), y: z.number() });

export const Type = z.object({
  id: z.string().uuid(),
  position: Coordinates,
  name: z.string().optional(),
  data: z.unknown(),
  type: z.string(),
  parent: z.string().optional(),
  final: z.literal(true).optional(),
  rendererButtonLabel: z.string().optional(),
});

export const Record = z.record(Type);

// ------------------------------------------------------------------
// Types

export type TNode = z.infer<typeof Type>;
export type TRecord = z.infer<typeof Record>;
export type TCoordinates = z.infer<typeof Coordinates>;
