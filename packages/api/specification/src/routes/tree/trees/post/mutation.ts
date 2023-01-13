import { FetchFn } from "@open-decision/api-helpers";
import { treesRoot } from "../../urls";
import { TCreateTreeInput } from "./input";
import { createTreeOutput, TCreateTreeOutput } from "./output";

export const createTree: FetchFn<TCreateTreeInput, TCreateTreeOutput> =
  (fetchFunction) => (inputs, config) => {
    return fetchFunction(treesRoot, {
      json: inputs.body,
      method: "POST",
      validation: createTreeOutput,
      proxied: true,
      ...config,
    });
  };
