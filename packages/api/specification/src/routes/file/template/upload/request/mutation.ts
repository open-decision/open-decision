import { FetchFn } from "@open-decision/api-helpers";
import { templateRequestUploadToken } from "../../../urls";
import { TRequestTemplateUploadInput } from "./input";
import {
  requestTemplateUploadOutput,
  TRequestTemplateUploadOutput,
} from "./output";

export const requestTemplateUpload: FetchFn<
  TRequestTemplateUploadInput,
  TRequestTemplateUploadOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(templateRequestUploadToken, {
    json: inputs.body,
    method: "POST",
    validation: requestTemplateUploadOutput,
    proxied: true,
    ...config,
  });
};
