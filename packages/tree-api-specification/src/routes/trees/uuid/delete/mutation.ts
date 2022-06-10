import { ClientConfig, Delete, safeFetch } from "@open-decision/api-helpers";
import { treesSingle } from "../../../urls";
import { TDeleteTreeInput } from "./input";

export const deleteTree =
  (context: ClientConfig): Delete<TDeleteTreeInput> =>
  async (inputs, config) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(combinedUrl, {
      headers: context.headers,
      method: "DELETE",
    });
  };
