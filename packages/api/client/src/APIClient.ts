import { safeFetchWithParse } from "@open-decision/api-helpers";
import { createAPIClient } from "./client";

export const APIClient = createAPIClient({
  apiUrl: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
  proxyUrl: `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/api/external-api`,
})(safeFetchWithParse);
