import { ClientConfig, Patch, safeFetch } from "@open-decision/api-helpers";
import { treesSingle } from "../../../../urls";
import { TUpdateTreeInput } from "./input";

export const updateTree =
  (context: ClientConfig): Patch<TUpdateTreeInput> =>
  async (inputs, config) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(combinedUrl, {
      headers: context.headers,
      body: JSON.stringify(inputs.body),
      method: "PATCH",
    });
  };
