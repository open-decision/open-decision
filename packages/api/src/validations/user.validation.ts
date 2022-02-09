import { z } from "zod";
import { isPasswordStrongEnough } from "./password.validation";
export const createUser = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .max(300)
      .refine(async (val) => isPasswordStrongEnough(val)),
    name: z.string(),
  }),
});

export const getUsers = z.object({
  query: z.object({
    name: z.string(),
    role: z.string(),
    sortBy: z.string(),
    limit: z.number().int(),
    page: z.number().int(),
  }),
});

export const getUser = z.object({
  params: z.object({
    userUuid: z.string().uuid(),
  }),
});

export const updateUser = z.object({
  params: z.object({
    userUuid: z.string().uuid(),
  }),
  body: z.object({
    password: z
      .string()
      .min(8)
      .max(300)
      .refine(async (val) => isPasswordStrongEnough(val))
      .optional(),
    email: z.string().email().optional(),
    name: z.string().optional(),
  }),
});

export const deleteUser = z.object({
  params: z.object({
    userUuid: z.string().uuid(),
  }),
});
