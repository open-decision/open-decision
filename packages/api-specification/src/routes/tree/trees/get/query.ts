import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { treesRoot } from "../../urls";
import { TGetTreesInput, getTreesOutput } from ".";

export const getTrees =
  (context: TContext) =>
  async (inputs?: TGetTreesInput, config?: QueryConfig) => {
    let combinedUrl = treesRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    if (inputs?.query) {
      combinedUrl = combinedUrl + `?${new URLSearchParams(inputs.query)}`;
    }

    return await context.fetchFunction(
      combinedUrl,
      {
        cache: "no-cache",
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      { validation: getTreesOutput }
    );
  };
