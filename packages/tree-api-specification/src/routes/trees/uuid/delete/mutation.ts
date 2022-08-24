import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { treesSingle } from "../../../../urls";
import { TDeleteTreeInput } from "./input";

export const deleteTree =
  (context: TContext) =>
  async (inputs: TDeleteTreeInput, config?: QueryConfig) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      {}
    );
  };
