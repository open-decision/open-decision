import { KyResponse, Options } from "ky";
import { z } from "zod";

export type TFetchFunctionConfig = Omit<Options, "prefixUrl"> & {
  origin?: string;
  proxied: boolean;
};

export type ClientFetchFn<TResponse extends Response = KyResponse> = (
  config: TClientConfig
) => (url: string, options: TFetchFunctionConfig) => Promise<TResponse>;

export type ClientFetchFnWithParse<TResponse extends Response = KyResponse> = (
  config: TClientConfig
) => <TValidation extends z.ZodType>(
  url: string,
  options: TFetchFunctionConfig & { validation?: TValidation }
) => Promise<{ response: TResponse; data: z.output<TValidation> }>;

export type TClientConfig = {
  token?: string;
  origin?: string;
  proxyUrl: string;
  apiUrl: string;
} & Omit<Options, "prefixUrl">;

export type TQueryConfig = TClientConfig;

export type FetchResponse<
  TResponse extends Response = Response,
  TData = unknown
> = {
  response: TResponse;
  data: TData;
};

export type FetchFn<TInput = unknown, TOutput = unknown> = (
  fetchFunction: ReturnType<ClientFetchFnWithParse>,
  config: TClientConfig
) => (
  inputs: TInput,
  config?: TQueryConfig
) => Promise<FetchResponse<KyResponse, TOutput>>;
