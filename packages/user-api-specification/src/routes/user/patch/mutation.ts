import { TContext, safeFetch, Post } from "@open-decision/api-helpers";
import { userRoot } from "../../../urls";
import { TUpdateUserInput } from "./input";

export const updateUser =
  (context: TContext): Post<TUpdateUserInput, void> =>
  async (inputs, config) => {
    let combinedUrl = userRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(combinedUrl, {
      body: inputs.body,
      headers: {
        authorization: `Bearer ${context.token}`,
      },
      method: "PATCH",
    });
  };
