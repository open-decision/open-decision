import { QueryConfig, FetchFn } from "@open-decision/api-helpers";
import { templateSingle } from "../../../urls";
import { TGetTemplateSingleInput } from "./input";
import { getTemplateSingleOutput, TGetTemplateSingleOutput } from "./output";

export const getTemplateSingle: FetchFn<
  TGetTemplateSingleInput,
  TGetTemplateSingleOutput
> =
  (fetchFunction) =>
  (inputs: TGetTemplateSingleInput, config?: QueryConfig) => {
    return fetchFunction(templateSingle(inputs.params.uuid), {
      cache: "no-cache",
      validation: getTemplateSingleOutput,
      proxied: true,
      ...config,
    });
  };
