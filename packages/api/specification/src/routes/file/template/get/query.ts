import { FetchFn } from "@open-decision/api-helpers";
import { templateRoot } from "../../urls";
import { TGetTemplateCollectionInput } from "./input";
import {
  getTemplateCollectionOutput,
  TGetTemplateCollectionOutput,
} from "./output";

export const getTemplateCollection: FetchFn<
  TGetTemplateCollectionInput,
  TGetTemplateCollectionOutput
> = (fetchFunction) => (_, config) => {
  return fetchFunction(templateRoot, {
    cache: "no-cache",
    validation: getTemplateCollectionOutput,
    proxied: true,
    ...config,
  });
};
