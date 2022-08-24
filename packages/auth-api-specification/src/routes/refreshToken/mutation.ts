import { TContext, prefixUrl, QueryConfig } from "@open-decision/api-helpers";
import { refreshTokenUrl } from "../../urls";
import { TRefreshTokenInput } from "./input";
import { refreshTokenOutput } from "./output";

export const refreshToken =
  (context: TContext) =>
  async (inputs: TRefreshTokenInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      refreshTokenUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await context.fetchFunction(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
      },
      {
        validation: refreshTokenOutput.passthrough(),
      }
    );
  };
