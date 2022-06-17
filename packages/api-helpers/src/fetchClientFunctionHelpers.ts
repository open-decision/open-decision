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
  authorization: JWTToken,
});

export const Context = z.object({
  urlPrefix: z.string().optional(),
  headers: AuthHeader.optional(),
});

export type TContext = z.infer<typeof Context>;

export type QueryConfig = TContext;

export type Get<TInput, TOutput> = (
  inputs: Omit<TInput, keyof TContext>,
  config?: QueryConfig
) => Promise<TOutput>;

export type Post<TInput, TOutput> = Get<TInput, TOutput>;

export type Patch<TInput> = (
  inputs: Omit<TInput, keyof TContext>,
  config?: QueryConfig
) => Promise<void>;

export type Delete<TInput> = Patch<TInput>;
