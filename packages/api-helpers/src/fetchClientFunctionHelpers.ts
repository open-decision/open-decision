import { z } from "zod";
import isJWT from "validator/lib/isJWT";

export const JWTToken = z.string().refine((val) => {
  if (typeof val !== "string") return false;

  const arr = val.split(" ");
  if (arr[0] === "Bearer" && isJWT(arr[1])) {
    return true;
  }

  return false;
});

export type TJWT = z.infer<typeof JWTToken>;

export const AuthHeader = z.object({
  authorization: JWTToken.optional(),
});

export const Context = z.object({
  urlPrefix: z.string().optional(),
  authPrefix: z.string().optional(),
  token: z.string().optional(),
  requestOrigin: z.string().optional(),
});

export type TContext = z.infer<typeof Context> & {
  headers?: HeadersInit;
};

export type QueryConfig = TContext;
