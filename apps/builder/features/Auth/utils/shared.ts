import { z } from "zod";
import { user } from "../types/user";

export const loginResponse = z.object({
  user,
  access: z.object({ token: z.string(), expires: z.string() }),
});

export type LoginResponse = z.infer<typeof loginResponse>;

export const validateLoginResponse = (responseBody: unknown) =>
  loginResponse.parse(responseBody);
