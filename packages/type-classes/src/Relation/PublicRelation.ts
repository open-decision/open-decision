import { z } from "zod";
import { BaseRelation } from "./shared";

export const Type = BaseRelation.extend({
  answer: z.string().min(1),
  target: z.string().min(1),
});

export type TRelation = z.infer<typeof Type>;
