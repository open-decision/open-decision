import { FetchFn } from "@open-decision/api-helpers";
import { resetPasswordUrl } from "../urls";
import { TResetPasswordInput } from "./input";
import { resetPasswordOutput, TResetPasswordOutput } from "./output";

export const resetPassword: FetchFn<
  TResetPasswordInput,
  TResetPasswordOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(resetPasswordUrl, {
    validation: resetPasswordOutput,
    json: inputs.body,
    method: "POST",
    proxied: true,
    ...config,
  });
};
