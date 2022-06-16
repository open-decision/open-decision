import {
  TContext,
  Post,
  prefixUrl,
  safeFetch,
} from "@open-decision/api-helpers";
import { verifyEmailUrl } from "../../urls";
import { TVerifyEmailInput } from "./input";
import { verifyEmailOutput, TVerifyEmailOutput } from "./output";

export const verifyEmail =
  (context: TContext): Post<TVerifyEmailInput, TVerifyEmailOutput> =>
  async (inputs, config) => {
    const combinedUrl = prefixUrl(
      verifyEmailUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        headers: context.headers,
        body: JSON.stringify(inputs.body),
        method: "POST",
      },
      { validation: verifyEmailOutput }
    );
  };
