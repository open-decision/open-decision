import {
  TContext,
  prefixUrl,
  safeFetch,
  QueryConfig,
} from "@open-decision/api-helpers";
import { loginUrl } from "../../urls";
import { TLoginInput } from "./input";
import { loginOutput } from "./output";

export const login =
  (context: TContext) => async (inputs: TLoginInput, config?: QueryConfig) => {
    const combinedUrl = prefixUrl(
      loginUrl,
      config?.urlPrefix ?? context.urlPrefix ?? ""
    );

    return await safeFetch(
      combinedUrl,
      {
        body: inputs.body,
        method: "POST",
      },
      { validation: loginOutput }
    );
  };
