import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateSingle } from "../../../urls";
import { TUpdateTemplateInputClient } from "./inputClient";
import { updateTemplateOutput } from "./output";

export const updateTemplate =
  (context: TContext) =>
  async (inputs: TUpdateTemplateInputClient, config?: QueryConfig) => {
    const formData = new FormData();

    formData.append("template", inputs.body.template);
    formData.append("displayName", inputs.body.displayName);

    let combinedUrl = templateSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        cache: "no-cache",
        body: formData,
        headers: {
          method: "POST",
          authorization: `Bearer ${context.token}`,
          "Content-Type": "multipart/form-data",
          ...context.headers,
        },
      },
      { validation: updateTemplateOutput, ...context.config }
    );
  };
