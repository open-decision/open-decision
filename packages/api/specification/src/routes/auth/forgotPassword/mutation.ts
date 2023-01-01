import { TContext, prefixUrl, QueryConfig } from "@open-decision/api-helpers";
import { forgotPasswordUrl } from "../urls";
import { TForgotPasswordInput } from "./input";
import { forgotPasswordOutput } from "./output";

export const forgotPassword =
  (context: TContext) =>
  async (inputs: TForgotPasswordInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      forgotPasswordUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await context.fetchFunction(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { validation: forgotPasswordOutput }
    );
  };
