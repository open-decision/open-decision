import { z } from "zod";

export const updateTemplateInputClient = z.object({
  params: z.object({
    uuid: z.string().uuid(),
  }),
  body: z.object({
    template: z.any(),
    displayName: z.string(),
  }),
});

export type TUpdateTemplateInputClient = z.infer<
  typeof updateTemplateInputClient
>;
