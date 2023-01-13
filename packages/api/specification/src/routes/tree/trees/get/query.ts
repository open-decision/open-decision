import { FetchFn } from "@open-decision/api-helpers";
import { treesRoot } from "../../urls";
import { TGetTreesInput, getTreesOutput, TGetTreesOutput } from ".";

export const getTrees: FetchFn<TGetTreesInput, TGetTreesOutput> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(treesRoot, {
      cache: "no-cache",
      searchParams: inputs.query,
      method: "GET",
      validation: getTreesOutput,
      proxied: true,
      ...config,
    });
  };
