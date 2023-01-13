import { FetchFn } from "@open-decision/api-helpers";
import { publishedTreesOfTreesCollection } from "../../../../urls";
import { TCreatePublishedTreeInput } from "./input";
import {
  createPublishedTreeOutput,
  TCreatePublishedTreeOutput,
} from "./output";

export const createPublishedTreeOfTree: FetchFn<
  TCreatePublishedTreeInput,
  TCreatePublishedTreeOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(
    publishedTreesOfTreesCollection(inputs.params.treeUuid),
    {
      json: inputs.body,
      method: "POST",
      validation: createPublishedTreeOutput,
      proxied: true,
      ...config,
    }
  );
};
