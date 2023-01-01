import {
  TContext,
  QueryConfig,
  FetchBlobFunction,
} from "@open-decision/api-helpers";
import { documentPreviewSingle } from "../../../../urls";
import { TGetDocumentSingleInput } from "../../../shared/input";

export const getDocumentPreviewSingle =
  (context: TContext<FetchBlobFunction>) =>
  async (inputs: TGetDocumentSingleInput, config?: QueryConfig) => {
    let combinedUrl = documentPreviewSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        cache: "no-cache",
        body: JSON.stringify(inputs.body),
        method: "POST",
        headers: {
          authorization: `Bearer ${context.token}`,
          "Content-Type": "application/json",
          ...context.headers,
        },
      },
      {}
    );
  };
