import { safeFetch } from "@open-decision/api-helpers";
import {
  TResetPasswordInput,
  TResetPasswordOutput,
} from "@open-decision/auth-api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "react-query";

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
  return useMutation<any, ODError, any, unknown>(({ token, password }) => {
    return safeFetch("/api/external-api/auth/reset-password", {
      method: "POST",
      body: { password, token },
    });
  }, config);
}
