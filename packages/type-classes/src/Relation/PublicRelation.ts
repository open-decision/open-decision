import { z } from "zod";
import { BaseRelation } from "./shared";

export const Type = BaseRelation.extend({
  answer: z.string(),
  target: z.string(),
});

export type TRelation = z.infer<typeof Type>;
