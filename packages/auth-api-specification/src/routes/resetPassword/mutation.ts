import {
  TContext,
  prefixUrl,
  safeFetch,
  QueryConfig,
} from "@open-decision/api-helpers";
import { resetPasswordUrl } from "../../urls";
import { TResetPasswordInput } from "./input";
import { resetPasswordOutput } from "./output";

export const resetPassword =
  (context: TContext) =>
  async (inputs: TResetPasswordInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      resetPasswordUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await context.fetchFunction(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
      },
      { validation: resetPasswordOutput }
    );
  };
