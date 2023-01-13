import { FetchFn } from "@open-decision/api-helpers";
import { z } from "zod";
import { getTokenUrl } from "../urls";

export const getTokenInput = z.void();
export type TGetTokenInput = z.infer<typeof getTokenInput>;
export const getTokenOutput = z.object({ token: z.string() });

export type TGetTokenOutput = z.infer<typeof getTokenOutput>;

export const getToken: FetchFn<TGetTokenInput, TGetTokenOutput> =
  (fetchFunction) => (_, config) => {
    return fetchFunction(getTokenUrl, {
      validation: getTokenOutput,
      proxied: true,
      ...config,
    });
  };
