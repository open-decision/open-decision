import { z } from "zod";

export const refreshTokenOutput = z.object({
  access: z.object({
    token: z.string(),
    expires: z.string(),
  }),
});

export type TRefreshTokenOutput = z.infer<typeof refreshTokenOutput>;
