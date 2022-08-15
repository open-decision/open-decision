import { TContext, prefixUrl, QueryConfig } from "@open-decision/api-helpers";
import { logoutUrl } from "../../urls";
import { TLogoutInput } from "./input";
import { logoutOutput } from "./output";

export const logout =
  (context: TContext) => async (_?: TLogoutInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      logoutUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await context.fetchFunction(
      combinedUrl,
      {
        method: "POST",
      },
      { validation: logoutOutput }
    );
  };
