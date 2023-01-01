import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { publishedTreesSingle } from "../../../urls";
import { TGetPublishedTreeInput } from "./input";
import { getPublishedTreeOutput } from "./output";

export const getPublishedTree =
  (context: TContext) =>
  async (inputs: TGetPublishedTreeInput, config?: QueryConfig) => {
    let combinedUrl = publishedTreesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      { validation: getPublishedTreeOutput }
    );
  };
