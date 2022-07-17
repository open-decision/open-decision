import { TContext, Delete, safeFetch } from "@open-decision/api-helpers";
import { publishedTreesSingle } from "../../../urls";
import { TDeletePublishedTreeInput } from "./input";

export const deletePublishedTree =
  (context: TContext): Delete<TDeletePublishedTreeInput> =>
  async (inputs, config) => {
    let combinedUrl = publishedTreesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(combinedUrl, {
      method: "DELETE",
    });
  };
