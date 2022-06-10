import { ClientConfig, Get, safeFetch } from "@open-decision/api-helpers";
import { publishedTreesOfTreesCollection } from "../../../../../urls";
import { TGetPublishedTreeInput } from "./input";
import { TGetPublishedTreeOutput, getPublishedTreeOutput } from "./output";

export const getPublishedTrees =
  (
    context: ClientConfig
  ): Get<TGetPublishedTreeInput, TGetPublishedTreeOutput> =>
  async (inputs, config) => {
    let combinedUrl = publishedTreesOfTreesCollection(inputs.params?.treeUuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      { headers: context.headers },
      { validation: getPublishedTreeOutput }
    );
  };
