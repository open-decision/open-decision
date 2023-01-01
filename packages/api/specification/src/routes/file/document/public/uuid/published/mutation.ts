import {
  TContext,
  QueryConfig,
  FetchBlobFunction,
} from "@open-decision/api-helpers";
import { documentPublishedSingle } from "../../../../urls";
import { TGetDocumentSingleInput } from "../../../shared/input";

export const getDocumentPublishedSingle =
  (context: TContext<FetchBlobFunction>) =>
  async (inputs: TGetDocumentSingleInput, config?: QueryConfig) => {
    let combinedUrl = documentPublishedSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        cache: "no-cache",
        body: JSON.stringify(inputs.body),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...context.headers,
        },
      },
      {}
    );
  };
