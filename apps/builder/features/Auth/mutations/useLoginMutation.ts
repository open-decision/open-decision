import {
  TLoginInput,
  TLoginOutput,
} from "@open-decision/auth-api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "react-query";
import { useOD } from "../../Data/odClient";

export function useLoginMutation(
  config?: Omit<
    UseMutationOptions<TLoginOutput, unknown, TLoginInput["body"], unknown>,
    "mutationFn"
  >
) {
  const OD = useOD("unauthenticated");

  return useMutation<any, ODError, any, unknown>(({ email, password }) => {
    return OD.auth.login({ body: { email, password } });
  }, config);
}
