import {
  TContext,
  Post,
  prefixUrl,
  safeFetch,
} from "@open-decision/api-helpers";
import { forgotPasswordUrl } from "../../urls";
import { TForgotPasswordInput } from "./input";
import { forgotPasswordOutput, TForgotPasswordOutput } from "./output";

export const forgotPassword =
  (context: TContext): Post<TForgotPasswordInput, TForgotPasswordOutput> =>
  async (inputs, config) => {
    const combinedUrl = prefixUrl(
      forgotPasswordUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
      },
      { validation: forgotPasswordOutput }
    );
  };
