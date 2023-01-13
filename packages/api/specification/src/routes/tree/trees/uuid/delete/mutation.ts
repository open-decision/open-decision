import { FetchFn } from "@open-decision/api-helpers";
import { treesSingle } from "../../../urls";
import { TDeleteTreeInput } from "./input";

export const deleteTree: FetchFn<TDeleteTreeInput, void> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(treesSingle(inputs.params.uuid), {
      method: "DELETE",
      proxied: true,
      ...config,
    });
  };
