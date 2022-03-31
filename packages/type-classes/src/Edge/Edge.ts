import { v4 as uuidV4 } from "uuid";
import { z } from "zod";

export const EdgeData = z.object({
  answer: z.string().optional(),
});

export const Type = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.enum(["default"]),
  data: EdgeData,
});

export function create({
  data,
  type = "default",
  ...edge
}: Omit<TEdge, "id" | "data" | "type"> & {
  data?: { answer?: string };
  type?: TEdge["type"];
}): TEdge {
  return {
    id: uuidV4(),
    data: {
      answer: "",
      ...data,
    },
    type,
    ...edge,
  };
}

export const Array = z.array(Type);

export type TEdge = z.infer<typeof Type>;
export type TEdgeArray = z.infer<typeof Array>;
export type TEdgeData = z.infer<typeof EdgeData>;
