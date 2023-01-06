import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateUploadRoot } from "../../../urls";
import { TCreateTemplateInputClient } from "./inputClient";
import { createTemplateOutput } from "./output";

export const createTemplate =
  (context: TContext) =>
  async (inputs: TCreateTemplateInputClient, config?: QueryConfig) => {
    const formData = new FormData();

    formData.append("template", inputs.body.template);
    formData.append("displayName", inputs.body.displayName);

    let combinedUrl = templateUploadRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix)
      combinedUrl = prefix + combinedUrl + `?token=${inputs.query.token}`;

    // The Content-Type header is omitted, because it is automatically added by
    // the browser when using FormData. We want the automatic header, because it
    // includes the boundary string. See:
    // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    return await context.fetchFunction(
      combinedUrl,
      {
        body: formData,
        method: "POST",
        headers: context.headers,
      },
      { validation: createTemplateOutput, ...context.config }
    );
  };
