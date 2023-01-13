import { QueryConfig, FetchFn } from "@open-decision/api-helpers";
import { templateUploadRoot } from "../../../urls";
import { TCreateTemplateInputClient } from "./inputClient";
import { createTemplateOutput, TCreateTemplateOutput } from "./output";

export const createTemplate: FetchFn<
  TCreateTemplateInputClient,
  TCreateTemplateOutput
> =
  (fetchFunction) =>
  async (inputs: TCreateTemplateInputClient, config?: QueryConfig) => {
    const formData = new FormData();

    formData.append("template", inputs.body.template);
    formData.append("displayName", inputs.body.displayName);

    return fetchFunction(templateUploadRoot, {
      body: formData,
      method: "POST",
      validation: createTemplateOutput,
      searchParams: inputs.query,
      proxied: false,
      ...config,
    });
  };
