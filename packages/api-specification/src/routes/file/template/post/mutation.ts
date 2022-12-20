import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateRoot } from "../../urls";
import { TCreateTemplateInputClient } from "./inputClient";
import { createTemplateOutput } from "./output";

//FIXME - data here needs to be passed as form data
export const createTemplate =
  (context: TContext) =>
  async (
    inputs: Omit<TCreateTemplateInputClient, "file">,
    config?: QueryConfig
  ) => {
    let combinedUrl = templateRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        cache: "no-cache",
        // body: inputs.body,
        headers: {
          method: "POST",
          authorization: `Bearer ${context.token}`,
          "Content-Type": "multipart/form-data",
          ...context.headers,
        },
      },
      { validation: createTemplateOutput }
    );
  };
