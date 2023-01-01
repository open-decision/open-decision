import { safeFetchJSON } from "@open-decision/api-helpers";
import {
  TLoginInput,
  TRegisterInput,
  TRegisterOutput,
} from "@open-decision/api-specification";
import { APIError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useRegisterMutation(
  config?: Omit<
    UseMutationOptions<
      TRegisterOutput,
      APIError<TLoginInput>,
      TRegisterInput["body"],
      unknown
    >,
    "mutationFn"
  >
) {
  return useMutation<any, APIError<TLoginInput>, any, unknown>(
    ["register"],
    ({ email, password, toc }) => {
      return safeFetchJSON(
        "/api/external-api/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ email, password, toc }),
          headers: {
            "Content-Type": "application/json",
          },
        },
        {}
      );
    },
    config
  );
}
