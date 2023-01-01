import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { publishedTreesOfTreesCollection } from "../../../../urls";
import { TGetPublishedTreeOfTreeInput } from "./input";
import { getPublishedTreesOfTreeOutput } from "./output";

export const getPublishedTreesOfTree =
  (context: TContext) =>
  async (inputs: TGetPublishedTreeOfTreeInput, config?: QueryConfig) => {
    let combinedUrl = publishedTreesOfTreesCollection(inputs.params?.treeUuid);
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
      { validation: getPublishedTreesOfTreeOutput }
    );
  };
