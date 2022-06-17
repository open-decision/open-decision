import {
  TContext,
  Post,
  prefixUrl,
  safeFetch,
} from "@open-decision/api-helpers";
import { logoutUrl } from "../../urls";
import { TLogoutInput } from "./input";
import { logoutOutput, TLogoutOutput } from "./output";

export const logout =
  (context: TContext): Post<Omit<TLogoutInput, "cookies">, TLogoutOutput> =>
  async (_, config) => {
    const combinedUrl = prefixUrl(
      logoutUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        headers: context.headers,
        method: "POST",
      },
      { validation: logoutOutput }
    );
  };
