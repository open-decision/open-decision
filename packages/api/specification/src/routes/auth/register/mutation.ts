import { TContext, prefixUrl, QueryConfig } from "@open-decision/api-helpers";
import { registerUrl } from "../urls";
import { TRegisterInput } from "./input";
import { registerOutput } from "./output";

export const register =
  (context: TContext) =>
  async (inputs: TRegisterInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      registerUrl,
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
      { validation: registerOutput, ...context.config }
    );
  };
