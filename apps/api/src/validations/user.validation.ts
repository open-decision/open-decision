import { z } from "zod";
import { isPasswordStrongEnough } from "./password.validation";
import validator from "validator";

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

export const deleteUser = z.object({
  params: z.object({
    userUuid: z.string().uuid(),
  }),
});

export const whitelistUsersForRegistration = z.object({
  body: z.object({
    emails: z.array(
      z.union([
        z.string().email(),
        z.string().refine((string) => validator.isFQDN(string)),
      ])
    ),
    sendInvite: z.boolean().optional(),
  }),
});

export const removeUsersFromWhitelist = z.object({
  body: z.object({
    emails: z.array(
      z.union([
        z.string().email(),
        z.string().refine((string) => validator.isFQDN(string)),
      ])
    ),
  }),
});

export const isWhitelisted = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});
