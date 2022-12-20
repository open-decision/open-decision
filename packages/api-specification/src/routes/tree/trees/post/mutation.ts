import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { treesRoot } from "../../urls";
import { TCreateTreeInput } from "./input";
import { createTreeOutput } from "./output";

export const createTree =
  (context: TContext) =>
  async (inputs: TCreateTreeInput, config?: QueryConfig) => {
    let combinedUrl = treesRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      { validation: createTreeOutput }
    );
  };
