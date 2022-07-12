import { TContext, Get, safeFetch } from "@open-decision/api-helpers";
import { publishedTreesOfTreesCollection } from "../../../../../urls";
import { TGetPublishedTreeOfTreeInput } from "./input";
import {
  TGetPublishedTreesOfTreeOutput,
  getPublishedTreesOfTreeOutput,
} from "./output";

export const getPublishedTreesOfTree =
  (
    context: TContext
  ): Get<TGetPublishedTreeOfTreeInput, TGetPublishedTreesOfTreeOutput> =>
  async (inputs, config) => {
    let combinedUrl = publishedTreesOfTreesCollection(inputs.params?.treeUuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      { cache: "no-cache" },
      { validation: getPublishedTreesOfTreeOutput }
    );
  };
