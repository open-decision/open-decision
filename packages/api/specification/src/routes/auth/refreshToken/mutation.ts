import { FetchFn } from "@open-decision/api-helpers";
import { refreshTokenUrl } from "../urls";
import { TRefreshTokenInput } from "./input";
import { refreshTokenOutput, TRefreshTokenOutput } from "./output";

export const refreshToken: FetchFn<TRefreshTokenInput, TRefreshTokenOutput> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(refreshTokenUrl, {
      validation: refreshTokenOutput.passthrough(),
      json: inputs.body,
      method: "POST",
      proxied: true,
      ...config,
    });
  };
