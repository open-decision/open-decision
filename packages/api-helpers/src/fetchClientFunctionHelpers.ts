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

type Config<TValidation extends z.ZodTypeAny> = {
  validation?: TValidation;
  retry?: number;
};

export type FetchFunction = <TValidation extends z.ZodTypeAny = z.ZodTypeAny>(
  url: string,
  {
    body,
    headers,
    ...options
  }: Omit<RequestInit, "body"> & {
    body?: Record<string, any>;
  },
  { validation, retry }: Config<TValidation>
) => Promise<{ data: z.output<TValidation>; status: number }>;

export type TContext = z.infer<typeof Context> & {
  headers?: HeadersInit;
  fetchFunction: FetchFunction;
  config?: Pick<Config<any>, "retry">;
};

export type QueryConfig = TContext;
