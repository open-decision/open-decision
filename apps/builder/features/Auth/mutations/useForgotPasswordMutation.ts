import { client } from "@open-decision/api-client";
import { safeFetchJSON } from "@open-decision/api-helpers";
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
  const OD = client({
    urlPrefix: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
    fetchFunction: safeFetchJSON,
  });

  return useMutation<any, ODError, any, unknown>(
    ["forgotPassword"],
    ({ email }) => {
      return OD.auth.forgotPassword({ body: { email } });
    },
    config
  );
}
