import { TContext, prefixUrl, QueryConfig } from "@open-decision/api-helpers";
import { loginUrl } from "../urls";
import { TLoginInput } from "./input";
import { loginOutput } from "./output";

export const login =
  (context: TContext) => async (inputs: TLoginInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      loginUrl,
      config?.urlPrefix ?? context.urlPrefix ?? ""
    );

    return await context.fetchFunction(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
      },
      { validation: loginOutput }
    );
  };
