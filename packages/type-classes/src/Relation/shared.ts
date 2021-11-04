import { z } from "zod";

export const BaseRelation = z.object({
  id: z.string(),
});
