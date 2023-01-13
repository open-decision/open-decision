import { FetchFn } from "@open-decision/api-helpers";
import { treePreview } from "../../../../../urls";
import { TGetTreePreviewInput } from "./input";
import { getTreePreviewOutput, TGetTreePreviewOutput } from "./output";

export const getSharedTreeContent: FetchFn<
  TGetTreePreviewInput,
  TGetTreePreviewOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(treePreview(inputs.params.uuid), {
    cache: "no-cache",
    validation: getTreePreviewOutput,
    proxied: false,
    ...config,
  });
};
