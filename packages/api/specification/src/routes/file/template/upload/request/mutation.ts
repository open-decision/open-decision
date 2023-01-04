import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { templateRequestUploadToken } from "../../../urls";
import { TRequestTemplateUploadInput } from "./input";
import { requestTemplateUploadOutput } from "./output";

export const requestTemplateUpload =
  (context: TContext) =>
  async (inputs: TRequestTemplateUploadInput, config?: QueryConfig) => {
    let combinedUrl = templateRequestUploadToken;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
        headers: {
          authorization: `Bearer ${context.token}`,
          "Content-Type": "application/json",
          ...context.headers,
        },
      },
      { validation: requestTemplateUploadOutput }
    );
  };
