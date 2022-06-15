import { AuthHeader } from "@open-decision/api-helpers";
import { z } from "zod";

export const deleteTreeInput = z.object({
  headers: AuthHeader,
  params: z.object({ uuid: z.string().uuid() }),
});

export type TDeleteTreeInput = z.infer<typeof deleteTreeInput>;
