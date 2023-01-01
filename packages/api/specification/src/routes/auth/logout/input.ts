import { z } from "zod";

export const logoutInput = z.object({
  body: z.object({ refreshToken: z.string() }),
});

export type TLogoutInput = z.infer<typeof logoutInput>;
