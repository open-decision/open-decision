import isJWT from "validator/lib/isJWT";
import { z } from "zod";

export const verifyEmailInput = z.object({
  body: z.object({
    token: z.string().refine((val) => isJWT(val), {
      message: "Token is not a valid JWT.",
    }),
  }),
});

export type TVerifyEmailInput = z.infer<typeof verifyEmailInput>;
