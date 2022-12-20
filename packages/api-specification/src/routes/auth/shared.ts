import { z } from "zod";
import isJWT from "validator/lib/isJWT";

export const authOuput = z.object({
  user: z.object({
    uuid: z.string().uuid(),
    email: z.string().email(),
    name: z.string().nullable(),
    emailIsVerified: z.boolean(),
    role: z.enum(["ADMIN", "USER", "DEVELOPER"]),
  }),
  access: z.object({
    token: z.object({
      token: z.string(),
      expires: z.string(),
    }),
    refreshToken: z.object({
      token: z.string(),
      expires: z.string(),
    }),
  }),
});

export const hasRefreshTokenInput = z.object({
  body: z.object({
    refreshToken: z.string().refine((val) => isJWT(val), {
      message: "Refresh token is not a valid JWT.",
    }),
  }),
});
