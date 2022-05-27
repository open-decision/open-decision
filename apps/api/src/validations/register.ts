import { z } from "zod";

export const register = {
  input: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8).max(300),
      // .refine(async (val) => isPasswordStrongEnough(val)),
    }),
  }),
  output: z.object({
    user: z.object({
      uuid: z.string().uuid(),
      email: z.string().email(),
      name: z.string().optional(),
      emailIsVerified: z.boolean(),
      role: z.enum(["ADMIN", "USER", "DEVELOPER"]),
    }),
    access: z.object({
      token: z.string(),
      expires: z.string(),
    }),
  }),
  url: "/auth/register",
};

export type TRegisterInput = z.infer<typeof register.input>;
export type TRegisterOutput = z.infer<typeof register.output>;
