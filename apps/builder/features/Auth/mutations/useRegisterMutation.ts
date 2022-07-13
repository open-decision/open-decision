import { safeFetch } from "@open-decision/api-helpers";
import {
  TLoginInput,
  TRegisterInput,
  TRegisterOutput,
} from "@open-decision/auth-api-specification";
import { APIError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "react-query";

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
    ({ email, password, toc }) => {
      return safeFetch("/api/external-api/auth/register", {
        method: "POST",
        body: { email, password, toc },
      });
    },
    config
  );
}
