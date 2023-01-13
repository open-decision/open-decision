import { FetchFn } from "@open-decision/api-helpers";
import { templateSingle } from "../../../urls";
import { TDeleteTemplateSingleInput } from "./input";
import {
  deleteTemplateSingleOutput,
  TDeleteTemplateSingleOutput,
} from "./output";

export const deleteTemplateSingle: FetchFn<
  TDeleteTemplateSingleInput,
  TDeleteTemplateSingleOutput
> = (fetchFunction) => (inputs, config) => {
  return fetchFunction(templateSingle(inputs.params.uuid), {
    cache: "no-cache",
    validation: deleteTemplateSingleOutput,
    proxied: true,
    ...config,
  });
};
