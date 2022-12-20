import isJWT from "validator/lib/isJWT";
import { z } from "zod";
import { isPasswordStrongEnough } from "../../../utils/password.validation";

export const resetPasswordInput = z.object({
  body: z.object({
    token: z.string().refine(isJWT, {
      message: "Token is not a valid JWT.",
    }),
    password: z
      .string()
      .min(8)
      .max(300)
      .refine(async (val) => isPasswordStrongEnough(val)),
  }),
});

export type TResetPasswordInput = z.infer<typeof resetPasswordInput>;
