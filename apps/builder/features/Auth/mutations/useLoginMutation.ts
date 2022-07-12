import {
  TLoginInput,
  TLoginOutput,
} from "@open-decision/auth-api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "react-query";

export function useLoginMutation(
  config?: Omit<
    UseMutationOptions<TLoginOutput, unknown, TLoginInput["body"], unknown>,
    "mutationFn"
  >
) {
  return useMutation<any, ODError, any, unknown>(({ email, password }) => {
    return fetch("/api/external-api/auth/login", {
      body: JSON.stringify({ email, password }),
      method: "POST",
    });
  }, config);
}
