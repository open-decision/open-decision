import { z } from "zod";

async function getResponseData(response: Response): Promise<unknown> {
  if (response.ok) {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) return await response.json();

    return response;
  }

  if (response.status >= 500) {
    throw new Error(
      "Es gab einen Error auf dem Server. Bitte versuchen Sie es erneut."
    );
  }

  if (response.status >= 400) {
    throw new Error(response.statusText);
  }

  throw new Error(response.statusText);
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
