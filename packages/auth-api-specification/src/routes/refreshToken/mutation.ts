import {
  TContext,
  Post,
  prefixUrl,
  safeFetch,
} from "@open-decision/api-helpers";
import { refreshTokenUrl } from "../../urls";
import { TRefreshTokenInput } from "./input";
import { refreshTokenOutput, TRefreshTokenOutput } from "./output";

export const refreshToken =
  (context: TContext): Post<TRefreshTokenInput, TRefreshTokenOutput> =>
  async (inputs, config) => {
    const combinedUrl = prefixUrl(
      refreshTokenUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
      },
      { validation: refreshTokenOutput.passthrough() }
    );
  };
