import { TContext, Get, safeFetch } from "@open-decision/api-helpers";
import { treesSingle } from "../../../../urls";
import { TGetTreeInput } from "./input";
import { TGetTreeOutput, getTreeOutput } from "./output";

export const getTree =
  (context: TContext): Get<TGetTreeInput, TGetTreeOutput> =>
  async (inputs, config) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;
    return await safeFetch(
      combinedUrl,
      { cache: "no-cache" },
      { validation: getTreeOutput }
    );
  };
