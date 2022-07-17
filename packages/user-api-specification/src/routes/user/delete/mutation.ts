import { TContext, Delete, safeFetch } from "@open-decision/api-helpers";
import { userRoot } from "../../../urls";
import { TDeleteUserInput } from "./input";

export const deleteUser =
  (context: TContext): Delete<TDeleteUserInput> =>
  async (_, config) => {
    let combinedUrl = userRoot;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    return await safeFetch(combinedUrl, {
      method: "DELETE",
    });
  };
