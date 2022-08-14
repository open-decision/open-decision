import { TContext, safeFetch, QueryConfig } from "@open-decision/api-helpers";
import { publishedTreesCollection } from "../../../urls";
import { TGetPublishedTreesInput } from "./input";
import { getPublishedTreesOutput } from "./output";

export const getPublishedTrees =
  (context: TContext) =>
  async (_?: TGetPublishedTreesInput, config?: QueryConfig) => {
    let combinedUrl = publishedTreesCollection;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        cache: "no-cache",
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      { validation: getPublishedTreesOutput }
    );
  };
