import { client } from "@open-decision/api-client";
import {
  TForgotPasswordInput,
  TForgotPasswordOutput,
} from "@open-decision/auth-api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "react-query";

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
    urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
  });

  return useMutation<any, ODError, any, unknown>(({ email }) => {
    return OD.auth.forgotPassword({ body: { email } });
  }, config);
}
