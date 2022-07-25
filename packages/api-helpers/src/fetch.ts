import { z } from "zod";
import { APIError, isAPIError } from "@open-decision/type-classes";

type Config<TValidation extends z.ZodTypeAny> = {
  validation?: TValidation;
};

export async function safeFetch<TValidation extends z.ZodTypeAny>(
  url: string,
  {
    body,
    headers,
    ...options
  }: Omit<RequestInit, "body"> & { body?: Record<string, any> },
  { validation }: Config<TValidation> = {}
): Promise<{ data: z.output<TValidation>; status: number }> {
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
    console.log(error);
    throw new APIError({
      code: "OFFLINE",
      message: "The request failed because the user is offline",
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
    console.log(error);
    if (isAPIError(error)) throw error;

    throw new APIError({
      code: "UNEXPECTED_ERROR",
      message: "Something unexpected happened when fetching from the API.",
    });
  }
}

export type FetchReturn<TData> = { data: TData; response: Response };
