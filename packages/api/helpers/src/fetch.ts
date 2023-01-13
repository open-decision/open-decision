import { APIError, isAPIError } from "@open-decision/type-classes";
import { KyResponse } from "ky";
import { z } from "zod";
import {
  ClientFetchFn,
  ClientFetchFnWithParse,
} from "./fetchClientFunctionHelpers";

export const safeFetch: ClientFetchFn = (config) => async (url, options) => {
  const ky = await import("ky");
  const { HTTPError } = await import("ky");

  try {
    return await ky.default(url, {
      retry: 0,
      ...config,
      ...options,
      headers: {
        authorization: options.proxied ? `Bearer ${config?.token}` : "",
        ...config?.headers,
        ...options.headers,
      },
      prefixUrl: options.proxied ? config?.proxyUrl : config?.apiUrl,
      hooks: {
        ...config?.hooks,
        ...options.hooks,
      },
    });
  } catch (error) {
    if (!(error instanceof HTTPError)) {
      // This catches all unknown errors
      throw new APIError({
        code: "OFFLINE",
        additionalData: { error },
      });
    }

    const errorResponse = await error.response.json();

    if (!isAPIError(errorResponse)) {
      throw new APIError({
        code: "UNEXPECTED_ERROR",
        additionalData: { errorResponse, error },
      });
    }

    throw errorResponse;
  }
};

export const parseResponse = <TValidation extends z.ZodType>(
  response: KyResponse,
  validation: TValidation
) => {
  const json = response.json();
  return validation.parse(json);
};

export const safeFetchWithParse: ClientFetchFnWithParse =
  (context) => async (url, config) => {
    const response = await safeFetch(context)(url, config);

    const json = config.validation ? await response.json() : "";

    return { response, data: config.validation?.parse(json) ?? "" };
  };
