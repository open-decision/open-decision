import { DeepPartial } from "utility-types";
import { z } from "zod";
import { v4 as uuid4 } from "uuid";

export const Type = z.object({
  id: z.string().uuid(),
  type: z.enum(["button"]),
  edges: z.array(z.string()),
});

export function create(): TRelation {
  return { id: uuid4(), type: "button", edges: [] };
}

export const Array = z.array(Type);

export type TRelation = z.infer<typeof Type>;
export type TRelationsArray = z.infer<typeof Array>;
