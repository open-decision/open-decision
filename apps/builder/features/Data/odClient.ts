import { client } from "@open-decision/api-client";
import { safeFetch } from "@open-decision/api-helpers";

export const OD = client({
  urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
  fetchFunction: safeFetch,
});

export const proxiedOD = client({
  requestOrigin: "client",
  urlPrefix: `/api/external-api`,
  fetchFunction: safeFetch,
});
