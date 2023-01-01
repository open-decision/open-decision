import { z } from "zod";

export const createTemplateInputClient = z.object({
  body: z.object({
    template: z.any(),
    treeUuid: z.string().uuid(),
    displayName: z.string(),
  }),
});

export type TCreateTemplateInputClient = z.infer<
  typeof createTemplateInputClient
>;
