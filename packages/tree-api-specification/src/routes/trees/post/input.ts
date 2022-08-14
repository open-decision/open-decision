import { TreeStatus } from "@open-decision/models";
import { z } from "zod";

export const createTreeInput = z.object({
  body: z.object({
    name: z.string(),
    status: z.enum(TreeStatus).optional(),
  }),
});

export type TCreateTreeInput = z.infer<typeof createTreeInput>;
