import { z } from "zod";

export const getTemplateFileSingleInput = z.object({
  params: z.object({
    uuid: z.string().uuid(),
  }),
});

export type TGetTemplateFileSingleInput = z.infer<
  typeof getTemplateFileSingleInput
>;
