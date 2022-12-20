import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateSingle } from "../../../urls";
import { TUpdateTemplateInputClient } from "./inputClient";
import { updateTemplateOutput } from "./output";

//FIXME - data here needs to be passed as form data
export const updateTemplate =
  (context: TContext) =>
  async (
    inputs: Omit<TUpdateTemplateInputClient, "file">,
    config?: QueryConfig
  ) => {
    let combinedUrl = templateSingle(inputs.params.uuid);
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
      { validation: updateTemplateOutput }
    );
  };
