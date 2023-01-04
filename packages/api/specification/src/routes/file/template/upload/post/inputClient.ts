import { z } from "zod";

export const createTemplateInputClient = z.object({
  body: z.object({
    template: z.any(),
    displayName: z.string(),
  }),
  query: z.object({
    token: z.string(),
  }),
});

export type TCreateTemplateInputClient = z.infer<
  typeof createTemplateInputClient
>;
