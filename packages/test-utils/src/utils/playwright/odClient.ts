import { client } from "@open-decision/api-client";
import { FetchJSONFunction } from "@open-decision/api-helpers";
import { APIRequestContext, request as globalRequest } from "@playwright/test";

const fetchFn =
  (request: APIRequestContext): FetchJSONFunction =>
  async (url, { body, method, headers }, { validation }) => {
    const response = await request.fetch(url, {
      data: body,
      method,
      headers: headers as any,
    });
    let data;
    const contentType = response.headers()["content-type"];
    if (
      contentType?.includes("application/json") &&
      response.status() !== 204
    ) {
      data = await response.json();
    }

    const parsedData = validation?.parse(data) ?? data;

    return { data: parsedData, status: response.status() };
  };

export const proxiedPlaywrightOD = async (request?: APIRequestContext) =>
  client({
    fetchFunction: fetchFn(request ?? (await globalRequest.newContext())),
    urlPrefix: "/api/external-api",
  });
