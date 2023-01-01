import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { treePreview } from "../../../../../urls";
import { TGetTreePreviewInput } from "./input";
import { getTreePreviewOutput } from "./output";

export const getTreePreview =
  (context: TContext) =>
  async (inputs: TGetTreePreviewInput, config?: QueryConfig) => {
    let combinedUrl = treePreview(inputs.params.uuid);
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;
    return await context.fetchFunction(
      combinedUrl,
      { cache: "no-cache" },
      { validation: getTreePreviewOutput }
    );
  };
