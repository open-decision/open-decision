import { TContext, safeFetch, QueryConfig } from "@open-decision/api-helpers";
import { treesSingle } from "../../../../urls";
import { TUpdateTreeInput } from "./input";

export const updateTree =
  (context: TContext) =>
  async (inputs: TUpdateTreeInput, config?: QueryConfig) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(combinedUrl, {
      body: inputs.body,
      method: "PATCH",
    });
  };
