import { ClientConfig, Get, safeFetch } from "@open-decision/api-helpers";
import { treesSingle } from "../../../../urls";
import { TGetTreeInput } from "./input";
import { TGetTreeOutput, getTreeOutput } from "./output";

export const getTree =
  (context: ClientConfig): Get<TGetTreeInput, TGetTreeOutput> =>
  async (inputs, config) => {
    let combinedUrl = treesSingle(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;
    return await safeFetch(
      combinedUrl,
      { headers: context.headers },
      { validation: getTreeOutput }
    );
  };
