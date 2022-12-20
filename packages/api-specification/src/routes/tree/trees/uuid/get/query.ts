import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { treesSingle } from "../../../urls";
import { TGetTreeInput } from "./input";
import { getTreeOutput } from "./output";

export const getTree =
  (context: TContext) =>
  async (inputs: TGetTreeInput, config?: QueryConfig) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
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
      { validation: getTreeOutput }
    );
  };
