import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateSingle } from "../../../urls";
import { TGetTemplateSingleInput } from "./input";
import { getTemplateSingleOutput } from "./output";

export const getTemplateSingle =
  (context: TContext) =>
  async (inputs: TGetTemplateSingleInput, config?: QueryConfig) => {
    let combinedUrl = templateSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        cache: "no-cache",
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      { validation: getTemplateSingleOutput, ...context.config }
    );
  };
