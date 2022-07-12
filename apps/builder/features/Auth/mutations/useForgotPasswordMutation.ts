import {
  TForgotPasswordInput,
  TForgotPasswordOutput,
} from "@open-decision/auth-api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "react-query";
import { useOD } from "../../Data/odClient";

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
  const OD = useOD();

  return useMutation<any, ODError, any, unknown>(({ email }) => {
    return OD.auth.forgotPassword({ body: { email } });
  }, config);
}
