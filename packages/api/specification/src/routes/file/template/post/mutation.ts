import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateRoot } from "../../urls";
import { TCreateTemplateInputClient } from "./inputClient";
import { createTemplateOutput } from "./output";

export const createTemplate =
  (context: TContext) =>
  async (inputs: TCreateTemplateInputClient, config?: QueryConfig) => {
    const formData = new FormData();

    formData.append("treeUuid", inputs.body.treeUuid);
    formData.append("displayName", inputs.body.displayName);
    formData.append("template", inputs.body.template);

    let combinedUrl = templateRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    // The Content-Type header is omitted, because it is automatically added by
    // the browser when using FormData. We want the automatic header, because it
    // includes the boundary string. See:
    // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    return await context.fetchFunction(
      combinedUrl,
      {
        cache: "no-cache",
        body: formData,
        method: "POST",
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      { validation: createTemplateOutput }
    );
  };
