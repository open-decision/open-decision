import { FetchFn } from "@open-decision/api-helpers";
import { publishedTreesOfTreesCollection } from "../../../../urls";
import { TGetPublishedTreeOfTreeInput } from "./input";
import {
  getPublishedTreesOfTreeOutput,
  TGetPublishedTreesOfTreeOutput,
} from "./output";

export const getPublishedTreesOfTreeContent: FetchFn<
  TGetPublishedTreeOfTreeInput,
  TGetPublishedTreesOfTreeOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(
    publishedTreesOfTreesCollection(inputs.params?.treeUuid),
    {
      cache: "no-cache",
      validation: getPublishedTreesOfTreeOutput,
      proxied: false,
      ...config,
    }
  );
};
