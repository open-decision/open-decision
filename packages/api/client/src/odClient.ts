import { safeFetchJSON } from "@open-decision/api-helpers";
import { client } from "./client";

export const directClient = client({
  urlPrefix: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
  fetchFunction: safeFetchJSON,
  headers: {
    credentials: "include",
  },
});

export const proxiedClient = client({
  requestOrigin: "client",
  urlPrefix: `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/api/external-api`,
  fetchFunction: safeFetchJSON,
  headers: {
    credentials: "include",
  },
});
