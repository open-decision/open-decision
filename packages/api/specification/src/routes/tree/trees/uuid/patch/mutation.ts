import { FetchFn } from "@open-decision/api-helpers";
import { treesSingle } from "../../../urls";
import { TUpdateTreeInput } from "./input";

export const updateTree: FetchFn<TUpdateTreeInput, void> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(treesSingle(inputs.params.uuid), {
      json: inputs.body,
      method: "PATCH",
      proxied: true,
      ...config,
    });
  };
