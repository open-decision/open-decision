import { TContext, Post, safeFetch } from "@open-decision/api-helpers";
import { treesCollection } from "../../../urls";
import { TCreateTreeInput } from "./input";
import { TCreateTreeOutput, createTreeOutput } from "./output";

export const createTree =
  (context: TContext): Post<TCreateTreeInput, TCreateTreeOutput> =>
  async (inputs, config) => {
    let combinedUrl = treesCollection;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
      },
      { validation: createTreeOutput }
    );
  };
