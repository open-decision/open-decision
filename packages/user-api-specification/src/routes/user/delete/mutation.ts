import { TContext, safeFetch, QueryConfig } from "@open-decision/api-helpers";
import { userRoot } from "../../../urls";
import { TDeleteUserInput } from "./input";

export const deleteUser =
  (context: TContext) => async (_?: TDeleteUserInput, config?: QueryConfig) => {
    let combinedUrl = userRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
      },
      {}
    );
  };
