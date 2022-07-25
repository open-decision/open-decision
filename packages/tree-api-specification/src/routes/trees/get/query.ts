import { TContext, safeFetch, QueryConfig } from "@open-decision/api-helpers";
import { treesCollection } from "../../../urls";
import { TGetTreesInput, getTreesOutput } from ".";

export const getTrees =
  (context: TContext) =>
  async (inputs: TGetTreesInput, config?: QueryConfig) => {
    let combinedUrl = treesCollection;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    if (inputs.query) {
      combinedUrl = combinedUrl + `?${new URLSearchParams(inputs.query)}`;
    }

    return await safeFetch(
      combinedUrl,
      {
        cache: "no-cache",
        headers: {
          authorization: `Bearer ${context.token}`,
        },
        ...context.headers,
      },
      { validation: getTreesOutput }
    );
  };
