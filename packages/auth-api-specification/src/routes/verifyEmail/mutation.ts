import {
  TContext,
  prefixUrl,
  safeFetch,
  QueryConfig,
} from "@open-decision/api-helpers";
import { verifyEmailUrl } from "../../urls";
import { TVerifyEmailInput } from "./input";
import { verifyEmailOutput } from "./output";

export const verifyEmail =
  (context: TContext) =>
  async (inputs: TVerifyEmailInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      verifyEmailUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
      },
      { validation: verifyEmailOutput }
    );
  };
