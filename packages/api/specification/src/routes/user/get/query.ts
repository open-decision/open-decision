import { FetchFn } from "@open-decision/api-helpers";
import { userRoot } from "../urls";
import { TGetUserInput } from "./input";
import { getUserOutput, TGetUserOutput } from "./output";

export const getUser: FetchFn<TGetUserInput, TGetUserOutput> =
  (fetchFunction) => (_, config) => {
    return fetchFunction(userRoot, {
      validation: getUserOutput,
      proxied: true,
      ...config,
    });
  };
