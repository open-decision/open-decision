import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateDownloadUrlSingle } from "../../../../urls";
import { TGetTemplateFileSingleInput } from "./input";
import { getTemplateFileSingleOutput } from "./output";

export const getTemplateFileSingle =
  (context: TContext) =>
  async (inputs: TGetTemplateFileSingleInput, config?: QueryConfig) => {
    let combinedUrl = templateDownloadUrlSingle(inputs.params.uuid);
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
      { validation: getTemplateFileSingleOutput }
    );
  };
