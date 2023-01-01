import { z } from "zod";

export const loginInput = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(300),
  }),
});

export type TLoginInput = z.infer<typeof loginInput>;
