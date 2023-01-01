import { safeFetchJSON } from "@open-decision/api-helpers";
import {
  TResetPasswordInput,
  TResetPasswordOutput,
} from "@open-decision/api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useResetPasswordMutation(
  config?: Omit<
    UseMutationOptions<
      TResetPasswordOutput,
      unknown,
      TResetPasswordInput["body"],
      unknown
    >,
    "mutationFn"
  >
) {
  return useMutation<any, ODError, any, unknown>(
    ["resetPassword"],
    ({ token, password }) => {
      return safeFetchJSON(
        "/api/external-api/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({ password, token }),
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
