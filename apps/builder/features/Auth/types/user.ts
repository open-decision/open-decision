import { z } from "zod";

export const user = z.object({
  uuid: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  role: z.enum(["USER", "ADMIN", "DEVELOPER"]),
  emailIsVerified: z.boolean(),
});

export type user = z.infer<typeof user>;
