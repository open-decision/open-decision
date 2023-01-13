import { FetchFn } from "@open-decision/api-helpers";
import { documentPreviewSingle } from "../../../../urls";
import { TGetDocumentSingleInput } from "../../../shared/input";
import { TGetDocumentSingleOutput } from "../../../shared/output";

export const getPrivateDocument: FetchFn<
  TGetDocumentSingleInput,
  TGetDocumentSingleOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(documentPreviewSingle(inputs.params.uuid), {
    cache: "no-cache",
    json: inputs.body,
    method: "POST",
    proxied: true,
    ...config,
  });
};
