import { TContext, safeFetch, QueryConfig } from "@open-decision/api-helpers";
import { treesCollection } from "../../../urls";
import { TCreateTreeInput } from "./input";
import { createTreeOutput } from "./output";

export const createTree =
  (context: TContext) =>
  async (inputs: TCreateTreeInput, config?: QueryConfig) => {
    let combinedUrl = treesCollection;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
      },
      { validation: createTreeOutput }
    );
  };
