import { QueryConfig, FetchFn } from "@open-decision/api-helpers";
import { documentPublishedSingle } from "../../../../urls";
import { TGetDocumentSingleInput } from "../../../shared/input";
import { TGetDocumentSingleOutput } from "../../../shared/output";

export const getPublishedDocument: FetchFn<
  TGetDocumentSingleInput,
  TGetDocumentSingleOutput
> =
  (fetchFunction) =>
  (inputs: TGetDocumentSingleInput, config?: QueryConfig) => {
    return fetchFunction(documentPublishedSingle(inputs.params.uuid), {
      cache: "no-cache",
      json: inputs.body,
      method: "POST",
      proxied: false,
      ...config,
    });
  };
