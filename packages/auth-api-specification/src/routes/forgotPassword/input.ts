import { z } from "zod";

export const forgotPasswordInput = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export type TForgotPasswordInput = z.infer<typeof forgotPasswordInput>;
