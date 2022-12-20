import { z } from "zod";

export const getTemplateSingleInput = z.object({
  params: z.object({
    uuid: z.string().uuid(),
  }),
});

export type TGetTemplateSingleInput = z.infer<typeof getTemplateSingleInput>;
