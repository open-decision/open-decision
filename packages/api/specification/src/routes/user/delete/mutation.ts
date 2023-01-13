import { FetchFn } from "@open-decision/api-helpers";
import { userRoot } from "../urls";
import { TDeleteUserInput } from "./input";

export const deleteUser: FetchFn<TDeleteUserInput, void> =
  (fetchFunction) => async (_, config) => {
    return fetchFunction(userRoot, {
      method: "DELETE",
      proxied: true,
      ...config,
    });
  };
