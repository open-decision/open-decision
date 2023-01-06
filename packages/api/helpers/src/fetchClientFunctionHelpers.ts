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
});

type Config<TValidation extends z.ZodTypeAny = z.ZodTypeAny> = {
  validation?: TValidation;
  retry?: number;
  origin: string;
};

export type FetchJSONFunction = <
  TValidation extends z.ZodTypeAny = z.ZodTypeAny
>(
  url: string,
  { body, headers, ...options }: RequestInit,
  { validation, retry, origin }: Config<TValidation>
) => Promise<FetchJSONReturn<z.output<TValidation>>>;

export type FetchBlobFunction = (
  url: string,
  { body, headers, ...options }: RequestInit,
  { retry, origin }: Omit<Config, "validation">
) => Promise<FetchBlobReturn>;

export type TContext<
  FetchFunction extends
    | FetchJSONFunction
    | FetchBlobFunction = FetchJSONFunction
> = z.infer<typeof Context> & {
  headers?: HeadersInit;
  fetchFunction: FetchFunction;
  config: Pick<Config<any>, "retry" | "origin">;
};

export type FetchJSONReturn<TData> = { data: TData; status: number };

export type FetchBlobReturn = { data: Blob; status: number };
export type FetchFunctions = FetchJSONFunction | FetchBlobFunction;

export type QueryConfig = TContext<FetchFunctions>;
