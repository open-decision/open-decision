import { FetchFn } from "@open-decision/api-helpers";
import { loginUrl } from "../urls";
import { TLoginInput } from "./input";
import { loginOutput, TLoginOutput } from "./output";

export const login: FetchFn<TLoginInput, TLoginOutput> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(loginUrl, {
      validation: loginOutput,
      method: "POST",
      json: inputs.body,
      proxied: true,
      ...config,
    });
  };
