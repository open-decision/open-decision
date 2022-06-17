import { z } from "zod";
import { isPasswordStrongEnough } from "../../utils/password.validation";

export const registerInput = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .max(300)
      .refine(async (val) => isPasswordStrongEnough(val)),
    toc: z.literal(true),
  }),
});
export type TRegisterInput = z.infer<typeof registerInput>;
