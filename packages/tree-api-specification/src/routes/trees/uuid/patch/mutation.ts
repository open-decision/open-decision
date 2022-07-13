import { TContext, Patch, safeFetch } from "@open-decision/api-helpers";
import { treesSingle } from "../../../../urls";
import { TUpdateTreeInput } from "./input";

export const updateTree =
  (context: TContext): Patch<TUpdateTreeInput> =>
  async (inputs, config) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(combinedUrl, {
      body: inputs.body,
      method: "PATCH",
    });
  };
