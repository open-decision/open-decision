import {
  TRegisterInput,
  TRegisterOutput,
} from "@open-decision/auth-api-specification";
import { ODError } from "@open-decision/type-classes";
import { useMutation, UseMutationOptions } from "react-query";
import { useOD } from "../../Data/odClient";

export function useRegisterMutation(
  config?: Omit<
    UseMutationOptions<
      TRegisterOutput,
      unknown,
      TRegisterInput["body"],
      unknown
    >,
    "mutationFn"
  >
) {
  const OD = useOD();

  return useMutation<any, ODError, any, unknown>(({ email, password, toc }) => {
    return OD.auth.register({ body: { email, password, toc } });
  }, config);
}
