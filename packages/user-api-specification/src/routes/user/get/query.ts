import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { userRoot } from "../../../urls";
import { TGetUserInput } from "./input";
import { getUserOutput } from "./output";

export const getUser =
  (context: TContext) => async (_?: TGetUserInput, config?: QueryConfig) => {
    let combinedUrl = userRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      { validation: getUserOutput }
    );
  };
