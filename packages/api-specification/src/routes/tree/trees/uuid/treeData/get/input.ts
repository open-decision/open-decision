import { z } from "zod";

export const getTreeDataInput = z.object({
  params: z.object({ uuid: z.string().uuid() }),
});

export type TGetTreeDataInput = z.infer<typeof getTreeDataInput>;
