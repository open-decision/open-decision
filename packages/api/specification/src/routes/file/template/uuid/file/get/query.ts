import { FetchFn } from "@open-decision/api-helpers";
import { templateDownloadUrlSingle } from "../../../../urls";
import { TGetTemplateFileSingleInput } from "./input";
import {
  getTemplateFileSingleOutput,
  TGetTemplateFileSingleOutput,
} from "./output";

export const getTemplateFileUrlSingle: FetchFn<
  TGetTemplateFileSingleInput,
  TGetTemplateFileSingleOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(templateDownloadUrlSingle(inputs.params.uuid), {
    cache: "no-cache",
    validation: getTemplateFileSingleOutput,
    proxied: true,
    ...config,
  });
};
