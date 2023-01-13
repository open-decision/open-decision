import { FetchFn } from "@open-decision/api-helpers";
import { treeDataSingle } from "../../../../urls";
import { TGetTreeDataInput } from "./input";
import { getTreeDataOutput, TGetTreeDataOutput } from "./output";

export const getPrivateTreeContent: FetchFn<
  TGetTreeDataInput,
  TGetTreeDataOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(treeDataSingle(inputs.params.uuid), {
    cache: "no-cache",
    validation: getTreeDataOutput,
    proxied: true,
    ...config,
  });
};
