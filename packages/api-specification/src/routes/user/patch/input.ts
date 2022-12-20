import { z } from "zod";
import { isPasswordStrongEnough } from "../../../utils/password.validation";

export const updateUserInput = z.object({
  body: z.object({
    password: z
      .string()
      .min(8)
      .max(300)
      .refine(async (val) => isPasswordStrongEnough(val), {
        message: "PASSWORD_TO_WEAK",
      })
      .optional(),
    email: z.string().email().optional(),
    name: z.string().optional(),
  }),
});

export type TUpdateUserInput = z.infer<typeof updateUserInput>;
