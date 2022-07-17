import { client } from "@open-decision/api-client";

export const OD = client({
  urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
});

export const proxiedOD = client({
  requestOrigin: "client",
  urlPrefix: `/api/external-api`,
});
