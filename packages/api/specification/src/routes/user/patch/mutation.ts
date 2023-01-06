import { TContext, QueryConfig } from "@open-decision/api-helpers";
import { userRoot } from "../urls";
import { TUpdateUserInput } from "./input";

export const updateUser =
  (context: TContext) =>
  async (inputs: TUpdateUserInput, config?: QueryConfig) => {
    let combinedUrl = userRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await context.fetchFunction(
      combinedUrl,
      {
        body: JSON.stringify(inputs.body),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${context.token}`,
          ...context.headers,
        },
        method: "PATCH",
      },
      { ...context.config }
    );
  };
