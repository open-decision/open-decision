import {
  TClientConfig,
  TFetchFunctionConfig,
} from "./fetchClientFunctionHelpers";

export const createPrefixedUrl =
  (context: TClientConfig) => (url: string, config: TFetchFunctionConfig) => {
    return config.proxied
      ? `${context.proxyUrl}/${url}`
      : `${context.apiUrl}/${url}`;
  };
