import { TContext, safeFetch, QueryConfig } from "@open-decision/api-helpers";
import { publishedTreesOfTreesCollection } from "../../../../../urls";
import { TGetPublishedTreeOfTreeInput } from "./input";
import { getPublishedTreesOfTreeOutput } from "./output";

export const getPublishedTreesOfTree =
  (context: TContext) =>
  async (inputs: TGetPublishedTreeOfTreeInput, config?: QueryConfig) => {
    let combinedUrl = publishedTreesOfTreesCollection(inputs.params?.treeUuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      { cache: "no-cache" },
      { validation: getPublishedTreesOfTreeOutput }
    );
  };
