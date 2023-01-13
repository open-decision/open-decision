import { FetchFn } from "@open-decision/api-helpers";
import { publishedTreesSingle } from "../../urls";
import { TDeletePublishedTreeInput } from "./input";

export const deletePublishedTree: FetchFn<TDeletePublishedTreeInput, void> =
  (fetchFunction) => async (inputs, config) => {
    return fetchFunction(publishedTreesSingle(inputs.params.uuid), {
      method: "DELETE",
      proxied: true,
      ...config,
    });
  };
