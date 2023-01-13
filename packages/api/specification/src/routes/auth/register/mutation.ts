import { FetchFn } from "@open-decision/api-helpers";
import { registerUrl } from "../urls";
import { TRegisterInput } from "./input";
import { registerOutput, TRegisterOutput } from "./output";

export const register: FetchFn<TRegisterInput, TRegisterOutput> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(registerUrl, {
      validation: registerOutput,
      json: inputs.body,
      method: "POST",
      proxied: true,
      ...config,
    });
  };
