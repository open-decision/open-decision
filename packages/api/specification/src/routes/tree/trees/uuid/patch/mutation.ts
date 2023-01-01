import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { treesSingle } from "../../../urls";
import { TUpdateTreeInput } from "./input";

export const updateTree =
  (context: TContext) =>
  async (inputs: TUpdateTreeInput, config?: QueryConfig) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      {}
    );
  };
