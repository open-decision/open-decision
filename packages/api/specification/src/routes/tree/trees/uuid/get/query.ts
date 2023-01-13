import { FetchFn } from "@open-decision/api-helpers";
import { treesSingle } from "../../../urls";
import { TGetTreeInput } from "./input";
import { getTreeOutput, TGetTreeOutput } from "./output";

export const getTree: FetchFn<TGetTreeInput, TGetTreeOutput> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(treesSingle(inputs.params.uuid), {
      cache: "no-cache",
      validation: getTreeOutput,
      method: "GET",
      proxied: true,
      ...config,
    });
  };
