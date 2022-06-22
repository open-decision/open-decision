import { z } from "zod";
import { APIError, ODError } from "@open-decision/type-classes";

async function getResponseData<TData>(
  response: Response
): Promise<TData | APIError> {
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) data = await response.json();

  if (response.status >= 400) {
    return new APIError(data);
  }

  return data;
}

type Config<TValidation extends z.ZodTypeAny> = {
  validation?: TValidation;
};

export const safeFetch = async <TValidation extends z.ZodTypeAny>(
  url: string,
  { body, headers, ...options }: RequestInit,
  { validation }: Config<TValidation> = {}
): Promise<z.output<TValidation>> => {
  const request = new Request(url, {
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? body : undefined,
    ...options,
  });
  try {
    const response = await fetch(request);

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) data = await response.json();

    if (response.status >= 400) {
      return new APIError(data);
    }

    return validation ? validation.parse(data) : data;
  } catch (error) {
    if (error instanceof Error) throw error;

    throw new ODError({
      code: "UNEXPECTED_ERROR",
      message: "Something unexpected happened when fetching from the API.",
    });
  }
};
