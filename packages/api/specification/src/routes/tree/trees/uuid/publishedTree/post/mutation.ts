import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { publishedTreesOfTreesCollection } from "../../../../urls";
import { TCreatePublishedTreeInput } from "./input";
import { createPublishedTreeOutput } from "./output";

export const createPublishedTreeOfTree =
  (context: TContext) =>
  async (inputs: TCreatePublishedTreeInput, config?: QueryConfig) => {
    let combinedUrl = publishedTreesOfTreesCollection(inputs.params.treeUuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      { validation: createPublishedTreeOutput }
    );
  };
