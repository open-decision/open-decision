import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateRoot } from "../../urls";
import { TGetTemplateCollectionInput } from "./input";
import { getTemplateCollectionOutput } from "./output";

export const getTemplateCollection =
  (context: TContext) =>
  async (_inputs: TGetTemplateCollectionInput, config?: QueryConfig) => {
    let combinedUrl = templateRoot;
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
      { validation: getTemplateCollectionOutput }
    );
  };
