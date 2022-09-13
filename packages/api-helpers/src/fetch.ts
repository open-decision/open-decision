import { APIError, isAPIError } from "@open-decision/type-classes";
import { FetchFunction } from "./fetchClientFunctionHelpers";
import { z } from "zod";

const getResponseData = async (response: Response) => {
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json") && response.status !== 204) {
    data = await response.json();
  }

  return data;
};

export const safeFetch: FetchFunction = async (
  url,
  { body, headers, ...options },
  { validation, retry = 0 }
) => {
  let retries = 0;

  const fetchFn = async (): Promise<Response> => {
    try {
      return await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });
    } catch (error) {
      if (retries < retry) {
        retries++;
        return await fetchFn();
      } else {
        throw new APIError({
          code: "OFFLINE",
          message:
            error instanceof Error ? error.message : "Error without message",
        });
      }
    }
  };

  let response = await fetchFn();

  try {
    if (response?.status >= 400) {
      if (retries < retry) {
        retries++;
        response = await fetchFn();
      } else {
        throw await getResponseData(response);
      }
    }

    const data = await getResponseData(response);
    const parsedData = validation?.parse(data) ?? data;

    return { data: parsedData, status: response.status };
  } catch (error) {
    console.error(error);
    if (isAPIError(error)) throw error;
    if (error instanceof z.ZodError) throw error;

    throw new APIError({
      code: "UNEXPECTED_ERROR",
      message: "Something unexpected happened when fetching from the API.",
    });
  }
};

export type FetchReturn<TData> = { data: TData; status: number };
