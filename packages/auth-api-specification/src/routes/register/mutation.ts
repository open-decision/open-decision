import {
  TContext,
  Post,
  prefixUrl,
  safeFetch,
} from "@open-decision/api-helpers";
import { registerUrl } from "../../urls";
import { TRegisterInput } from "./input";
import { registerOutput, TRegisterOutput } from "./output";

export const register =
  (context: TContext): Post<TRegisterInput, TRegisterOutput> =>
  async (inputs, config) => {
    const combinedUrl = prefixUrl(
      registerUrl,
      config?.urlPrefix ?? context.urlPrefix
    );

    return await safeFetch(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        method: "POST",
      },
      { validation: registerOutput }
    );
  };
