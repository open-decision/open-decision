import { z } from "zod";
import { APIError } from "@open-decision/type-classes";

async function getResponseData(response: Response): Promise<unknown> {
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) data = await response.json();

  if (response.status >= 400) {
    throw new APIError(data);
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

  const response = fetch(request);

  const responseData = await getResponseData(await response);

  return validation ? validation.parse(responseData) : responseData;
};
