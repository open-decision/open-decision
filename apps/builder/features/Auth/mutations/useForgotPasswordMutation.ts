import { directClient } from "@open-decision/api-client";
import {
  TForgotPasswordInput,
  TForgotPasswordOutput,
} from "@open-decision/api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useForgotPasswordMutation(
  config?: Omit<
    UseMutationOptions<
      TForgotPasswordOutput,
      unknown,
      TForgotPasswordInput["body"],
      unknown
    >,
    "mutationFn"
  >
) {
  return useMutation<any, ODError, any, unknown>(
    ["forgotPassword"],
    ({ email }) => {
      return directClient("client").auth.forgotPassword({ body: { email } });
    },
    config
  );
}
