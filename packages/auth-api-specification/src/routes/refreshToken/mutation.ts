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
  async (_, config) => {
    const combinedUrl = prefixUrl(
      refreshTokenUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        headers: context.headers,
        method: "POST",
      },
      { validation: refreshTokenOutput }
    );
  };
