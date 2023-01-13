import { FetchFn } from "@open-decision/api-helpers";
import { userRoot } from "../urls";
import { TUpdateUserInput } from "./input";

export const updateUser: FetchFn<TUpdateUserInput, any> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(userRoot, {
      json: inputs.body,
      method: "PATCH",
      proxied: true,
      ...config,
    });
  };
