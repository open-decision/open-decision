import { AuthHeader } from "@open-decision/api-helpers";
import { z } from "zod";

export const createTreeInput = z.object({
  headers: AuthHeader,
  body: z.object({
    name: z.string(),
  }),
});

export type TCreateTreeInput = z.infer<typeof createTreeInput>;
