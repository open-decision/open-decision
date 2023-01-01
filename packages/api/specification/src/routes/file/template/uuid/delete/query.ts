import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateSingle } from "../../../urls";
import { TDeleteTemplateSingleInput } from "./input";
import { deleteTemplateSingleOutput } from "./output";

export const deleteTemplateSingle =
  (context: TContext) =>
  async (inputs: TDeleteTemplateSingleInput, config?: QueryConfig) => {
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
      { validation: deleteTemplateSingleOutput }
    );
  };
