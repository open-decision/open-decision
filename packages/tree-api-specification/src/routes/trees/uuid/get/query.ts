import { TContext, safeFetch, QueryConfig } from "@open-decision/api-helpers";
import { treesSingle } from "../../../../urls";
import { TGetTreeInput } from "./input";
import { getTreeOutput } from "./output";

export const getTree =
  (context: TContext) =>
  async (inputs: TGetTreeInput, config?: QueryConfig) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;
    return await safeFetch(
      combinedUrl,
      { cache: "no-cache" },
      { validation: getTreeOutput }
    );
  };
