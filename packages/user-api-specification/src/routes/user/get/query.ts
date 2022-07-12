import { TContext, Get, safeFetch } from "@open-decision/api-helpers";
import { userRoot } from "../../../urls";
import { TGetUserInput } from "./input";
import { getUserOutput, TGetUserOutput } from "./output";

export const getUser =
  (context: TContext): Get<TGetUserInput, TGetUserOutput> =>
  async (_, config) => {
    let combinedUrl = userRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(
      combinedUrl,
      {
        cache: "no-cache",
        headers: {
          authorization: `Bearer ${context.token}`,
        },
        ...context.headers,
      },
      { validation: getUserOutput }
    );
  };
