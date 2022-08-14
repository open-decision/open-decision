import { APIError, isAPIError } from "@open-decision/type-classes";
import { FetchFunction } from "./fetchClientFunctionHelpers";

export const safeFetch: FetchFunction = async (
  url,
  { body, headers, ...options },
  { validation } = {}
) => {
  let response;

  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch (error) {
    console.error(error);
    throw new APIError({
      code: "OFFLINE",
      message: "The user is offline. So the request failed.",
    });
  }

  try {
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json") && response.status !== 204) {
      data = await response.json();
    }

    if (response.status >= 400) {
      throw data;
    }

    const parsedData = validation?.parse(data) ?? data;

    return { data: parsedData, status: response.status };
  } catch (error) {
    console.error(error);
    if (isAPIError(error)) throw error;

    throw new APIError({
      code: "UNEXPECTED_ERROR",
      message: "Something unexpected happened when fetching from the API.",
    });
  }
};

export type FetchReturn<TData> = { data: TData; status: number };
