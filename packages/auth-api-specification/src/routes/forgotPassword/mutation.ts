import {
  TContext,
  prefixUrl,
  safeFetch,
  QueryConfig,
} from "@open-decision/api-helpers";
import { forgotPasswordUrl } from "../../urls";
import { TForgotPasswordInput } from "./input";
import { forgotPasswordOutput } from "./output";

export const forgotPassword =
  (context: TContext) =>
  async (inputs: TForgotPasswordInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      forgotPasswordUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
      },
      { validation: forgotPasswordOutput }
    );
  };
