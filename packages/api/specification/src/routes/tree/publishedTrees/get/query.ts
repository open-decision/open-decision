import { FetchFn } from "@open-decision/api-helpers";
import { publishedTreesRoot } from "../../urls";
import { TGetPublishedTreesInput } from "./input";
import { getPublishedTreesOutput, TGetPublishedTreesOutput } from "./output";

export const getPublishedTrees: FetchFn<
  TGetPublishedTreesInput,
  TGetPublishedTreesOutput
> = (fetchFunction) => (_, config) => {
  return fetchFunction(publishedTreesRoot, {
    cache: "no-cache",
    validation: getPublishedTreesOutput,
    proxied: true,
    ...config,
  });
};
