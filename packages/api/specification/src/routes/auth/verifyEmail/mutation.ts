import { FetchFn } from "@open-decision/api-helpers";
import { verifyEmailUrl } from "../urls";
import { TVerifyEmailInput } from "./input";

export const verifyEmail: FetchFn<TVerifyEmailInput, void> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(verifyEmailUrl, {
      json: inputs.body,
      method: "POST",
      proxied: true,
      ...config,
    });
  };
