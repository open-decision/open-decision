import { FetchFn } from "@open-decision/api-helpers";
import { TLoginInput } from "../login";
import { verifyLoginUrl } from "../urls";

export const verifyLogin: FetchFn<TLoginInput, void> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(verifyLoginUrl, {
      json: inputs.body,
      method: "POST",
      proxied: true,
      ...config,
    });
  };
