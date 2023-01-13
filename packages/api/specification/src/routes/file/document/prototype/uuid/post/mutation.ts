import { QueryConfig, FetchFn } from "@open-decision/api-helpers";
import { documentPrototypeSingle } from "../../../../urls";
import { TGetDocumentSingleInput } from "../../../shared/input";
import { TGetDocumentSingleOutput } from "../../../shared/output";

export const getSharedDocument: FetchFn<
  TGetDocumentSingleInput,
  TGetDocumentSingleOutput
> =
  (fetchFunction) =>
  (inputs: TGetDocumentSingleInput, config?: QueryConfig) => {
    return fetchFunction(documentPrototypeSingle(inputs.params.uuid), {
      json: inputs.body,
      method: "POST",
      proxied: false,
      ...config,
    });
  };
