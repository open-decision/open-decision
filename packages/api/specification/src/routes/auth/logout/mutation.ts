import { FetchFn } from "@open-decision/api-helpers";
import { logoutUrl } from "../urls";
import { TLogoutInput } from "./input";

export const logout: FetchFn<TLogoutInput, void> =
  (fetchFunction) => async (inputs, config) => {
    return await fetchFunction(logoutUrl, {
      method: "POST",
      json: inputs.body,
      proxied: true,
      ...config,
    });
  };
