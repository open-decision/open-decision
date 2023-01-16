import { QueryConfig, FetchFn } from "@open-decision/api-helpers";
import { publishedTreesSingle } from "../../../urls";
import { TGetPublishedTreeInput } from "./input";
import { getPublishedTreeOutput, TGetPublishedTreeOutput } from "./output";

export const getPublishedTree: FetchFn<
  TGetPublishedTreeInput,
  TGetPublishedTreeOutput
> =
  (fetchFunction) => (inputs: TGetPublishedTreeInput, config?: QueryConfig) => {
    return fetchFunction(publishedTreesSingle(inputs.params.uuid), {
      validation: getPublishedTreeOutput,
      proxied: false,
      ...config,
    });
  };
