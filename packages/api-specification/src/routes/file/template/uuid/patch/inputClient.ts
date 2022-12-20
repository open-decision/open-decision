import { z } from "zod";

export const updateTemplateInputClient = z.object({
  params: z.object({
    uuid: z.string().uuid(),
  }),
});

export type TUpdateTemplateInputClient = z.infer<
  typeof updateTemplateInputClient
>;
