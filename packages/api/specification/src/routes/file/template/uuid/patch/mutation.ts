import { FetchFn } from "@open-decision/api-helpers";
import { templateSingle } from "../../../urls";
import { TUpdateTemplateInputClient } from "./inputClient";
import { TUpdateTemplateOutput, updateTemplateOutput } from "./output";

export const updateTemplate: FetchFn<
  TUpdateTemplateInputClient,
  TUpdateTemplateOutput
> = (fetchFunction) => (inputs, config) => {
  const formData = new FormData();

  formData.append("template", inputs.body.template);
  formData.append("displayName", inputs.body.displayName);

  return fetchFunction(templateSingle(inputs.params.uuid), {
    method: "POST",
    cache: "no-cache",
    body: formData,
    validation: updateTemplateOutput,
    proxied: true,
    ...config,
  });
};
