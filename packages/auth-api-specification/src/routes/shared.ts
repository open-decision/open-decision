import { z } from "zod";
import isJWT from "validator/lib/isJWT";

export const authOuput = z.object({
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
});

export const hasRefreshTokenCookieInput = z.object({
  cookies: z.object({
    refreshCookie: z.string().refine((val) => isJWT(val), {
      message: "Refresh token is not a valid JWT.",
    }),
  }),
});
