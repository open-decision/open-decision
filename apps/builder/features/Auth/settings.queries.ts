import { APIError } from "@open-decision/type-classes";
import { TUpdateUserInput } from "@open-decision/user-api-specification";
import { useMutation, UseMutationOptions } from "react-query";
import { proxiedOD } from "../Data/odClient";
import { useLogoutMutation } from "./mutations/useLogoutMutation";

export const useUserUpdateMutation = (
  options?: UseMutationOptions<
    unknown,
    APIError<TUpdateUserInput>,
    Partial<TUpdateUserInput["body"]>
  >
) => {
  return useMutation(
    "updateUser",
    (data: Partial<TUpdateUserInput["body"]>) => {
      return proxiedOD.user.updateUser({ body: data });
    },
    options
  );
};

export const useDeleteUserMutation = (options?: UseMutationOptions) => {
  const { mutate: logout } = useLogoutMutation();

  return useMutation(
    "deleteUser",
    () => {
      return proxiedOD.user.deleteUser({});
    },
    {
      onSettled: (_data, _error, _variables, _context) => logout(),
      ...options,
    }
  );
};
