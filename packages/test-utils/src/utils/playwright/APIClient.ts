import { createAPIClient } from "@open-decision/api-client";
import {
  ClientFetchFnWithParse,
  createPrefixedUrl,
} from "@open-decision/api-helpers";
import { APIRequestContext, request as globalRequest } from "@playwright/test";

const fetchFn =
  (request: APIRequestContext): ClientFetchFnWithParse<any> =>
  (context) =>
  async (url, config) => {
    const prefixedUrl = createPrefixedUrl(context)(url, config);

    const response = await request.fetch(prefixedUrl, {
      data: config.json ?? config.body,
      method: config.method,
      headers: { ...context.headers, ...config.headers } as any,
    });

    let data;
    const contentType = response.headers()["content-type"];

    if (
      contentType?.includes("application/json") &&
      response.status() !== 204
    ) {
      data = await response.json();
    }

    const parsedData = config.validation?.parse(data) ?? data;

    return { response, data: parsedData };
  };

export const proxiedPlaywrightOD = async (request?: APIRequestContext) =>
  createAPIClient({
    apiUrl: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
    proxyUrl: `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/api/external-api`,
    origin: "test",
  })(fetchFn(request ?? (await globalRequest.newContext())));
