import { z } from "zod";
// const { password, objectId } = require('./custom.validation');

export const createUser = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
    role: z.enum(["USER", "STAFF", "ADMIN"]),
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
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
  }),
});

export const deleteUser = z.object({
  params: z.object({
    userUuid: z.string().uuid(),
  }),
});
