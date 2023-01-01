import { z } from "zod";

export const deleteTemplateSingleInput = z.object({
  params: z.object({
    uuid: z.string().uuid(),
  }),
});

export type TDeleteTemplateSingleInput = z.infer<
  typeof deleteTemplateSingleInput
>;
