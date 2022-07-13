import { z } from "zod";
import { APIError, isAPIError } from "@open-decision/type-classes";

type Config<TValidation extends z.ZodTypeAny> = {
  validation?: TValidation;
};

export const safeFetch = async <TValidation extends z.ZodTypeAny>(
  url: string,
  { body, headers, ...options }: RequestInit,
  { validation }: Config<TValidation> = {}
): Promise<{ data: z.output<TValidation>; response: Response }> => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? body : undefined,
      ...options,
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) data = await response.json();

    if (response.status >= 400 && isAPIError(data)) {
      throw data;
    }

    return { data: validation?.parse(data) ?? data, response };
  } catch (error) {
    if (isAPIError(error)) throw error;

    throw new APIError({
      code: "UNEXPECTED_ERROR",
      message: "Something unexpected happened when fetching from the API.",
    });
  }
};
