import { TContext, Post, safeFetch } from "@open-decision/api-helpers";
import { publishedTreesOfTreesCollection } from "../../../../../urls";
import { TCreatePublishedTreeInput } from "./input";
import {
  TCreatePublishedTreeOutput,
  createPublishedTreeOutput,
} from "./output";

export const createPublishedTreeOfTree =
  (
    context: TContext
  ): Post<TCreatePublishedTreeInput, TCreatePublishedTreeOutput> =>
  async (inputs, config) => {
    let combinedUrl = publishedTreesOfTreesCollection(inputs.params.treeUuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
      },
      { validation: createPublishedTreeOutput }
    );
  };
