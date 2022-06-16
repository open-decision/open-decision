import { TContext, Get, safeFetch } from "@open-decision/api-helpers";
import { publishedTreesCollection } from "../../../urls";
import { TGetPublishedTreesInput } from "./input";
import { getPublishedTreesOutput, TGetPublishedTreesOutput } from "./output";

export const getPublishedTrees =
  (context: TContext): Get<TGetPublishedTreesInput, TGetPublishedTreesOutput> =>
  async (inputs, config) => {
    let combinedUrl = publishedTreesCollection;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      { headers: context.headers, cache: "no-cache" },
      { validation: getPublishedTreesOutput }
    );
  };
