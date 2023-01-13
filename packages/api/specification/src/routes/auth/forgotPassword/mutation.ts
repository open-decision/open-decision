import { FetchFn } from "@open-decision/api-helpers";
import { forgotPasswordUrl } from "../urls";
import { TForgotPasswordInput } from "./input";

export const forgotPassword: FetchFn<TForgotPasswordInput, void> =
  (fetchFunction) => (inputs, config) =>
    fetchFunction(forgotPasswordUrl, {
      json: inputs.body,
      method: "POST",
      proxied: true,
      ...config,
    });
