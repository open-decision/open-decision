import {
  TResetPasswordInput,
  TResetPasswordOutput,
} from "@open-decision/auth-api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "react-query";
import { useOD } from "../../Data/odClient";

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
  const OD = useOD("unauthenticated");

  return useMutation<any, ODError, any, unknown>(({ token, password }) => {
    return OD.auth.resetPassword({ body: { password, token } });
  }, config);
}
