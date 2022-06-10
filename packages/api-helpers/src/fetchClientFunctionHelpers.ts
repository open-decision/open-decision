import { z } from "zod";
import isJWT from "validator/lib/isJWT";

export const AuthHeader = z.object({
  authorization: z.custom<`Bearer ${string}`>((val) => {
    if (typeof val !== "string") return false;

    const arr = val.split(" ");
    if (arr[0] === "Bearer" && isJWT(arr[1])) {
      return true;
    }

    return false;
  }),
});

export const ClientConfig = z.object({
  headers: AuthHeader,
  urlPrefix: z.string().optional(),
});

export type ClientConfig = z.infer<typeof ClientConfig>;

export type QueryConfig = ClientConfig;

export type Get<TInput, TOutput> = (
  inputs: Omit<TInput, keyof ClientConfig>,
  config?: QueryConfig
) => Promise<TOutput>;

export type Post<TInput, TOutput> = Get<TInput, TOutput>;

export type Patch<TInput> = (
  inputs: Omit<TInput, keyof ClientConfig>,
  config?: QueryConfig
) => Promise<void>;

export type Delete<TInput> = Patch<TInput>;
