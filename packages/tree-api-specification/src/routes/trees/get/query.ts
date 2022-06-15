import { ClientConfig, Get, safeFetch } from "@open-decision/api-helpers";
import { treesCollection } from "../../../urls";
import { TGetTreesInput, TGetTreesOutput, getTreesOutput } from ".";

export const getTrees =
  (context: ClientConfig): Get<TGetTreesInput, TGetTreesOutput> =>
  async (inputs, config) => {
    let combinedUrl = treesCollection;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    if (inputs.query) {
      combinedUrl = combinedUrl + `?${new URLSearchParams(inputs.query)}`;
    }

    return await safeFetch(
      combinedUrl,
      { headers: context.headers, cache: "no-cache" },
      { validation: getTreesOutput }
    );
  };
