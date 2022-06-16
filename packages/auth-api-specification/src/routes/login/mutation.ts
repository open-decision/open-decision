import {
  TContext,
  Post,
  prefixUrl,
  safeFetch,
} from "@open-decision/api-helpers";
import { loginUrl } from "../../urls";
import { TLoginInput } from "./input";
import { loginOutput, TLoginOutput } from "./output";

export const login =
  (context: TContext): Post<TLoginInput, TLoginOutput> =>
  async (inputs, config) => {
    const combinedUrl = prefixUrl(
      loginUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        headers: context.headers,
        body: JSON.stringify(inputs.body),
        method: "POST",
      },
      { validation: loginOutput }
    );
  };
