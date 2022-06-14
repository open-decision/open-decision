import { ClientConfig, Get, safeFetch } from "@open-decision/api-helpers";
import { publishedTreesSingle } from "../../../../urls";
import { TGetPublishedTreeInput } from "./input";
import { getPublishedTreeOutput, TGetPublishedTreeOutput } from "./output";

export const getPublishedTree =
  (
    context: ClientConfig
  ): Get<TGetPublishedTreeInput, TGetPublishedTreeOutput> =>
  async (inputs, config) => {
    let combinedUrl = publishedTreesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    // if (inputs.query) {
    //   combinedUrl = combinedUrl + `?${new URLSearchParams(inputs.query)}`;
    // }

    return await safeFetch(
      combinedUrl,
      { headers: context.headers },
      { validation: getPublishedTreeOutput }
    );
  };
