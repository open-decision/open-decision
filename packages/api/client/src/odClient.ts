import { safeFetchJSON } from "@open-decision/api-helpers";
import { client } from "./client";

export const directClient = (origin: string) =>
  client({
    urlPrefix: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
    fetchFunction: safeFetchJSON,
    headers: {
      credentials: "include",
    },
    config: { origin },
  });

export const proxiedClient = (origin: string) =>
  client({
    urlPrefix: `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/api/external-api`,
    fetchFunction: safeFetchJSON,
    headers: {
      credentials: "include",
    },
    config: { origin },
  });
