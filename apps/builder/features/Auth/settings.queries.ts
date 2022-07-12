import { TGetUserOutput } from "@open-decision/user-api-specification";
import { useMutation, UseMutationOptions } from "react-query";
import { useLogoutMutation } from "./mutations/useLogoutMutation";

type Data = {
  name?: string;
  email?: string;
  password?: string;
  user: TGetUserOutput;
};

export const useUserUpdateMutation = (
  options?: UseMutationOptions<unknown, unknown, Data>
) => {
  return useMutation(
    "updateUser",
    (data: Data) => {
      return fetch(`/api/external-api/users/${data.user.id}`, {
        body: JSON.stringify(data),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    options
  );
};

export const useDeleteUserMutation = (options?: UseMutationOptions) => {
  const { mutate: logout } = useLogoutMutation();

  return useMutation(
    "deleteUser",
    (user: TGetUserOutput) => {
      return fetch(`/api/external-api/users/${user.id}`, {
        method: "DELETE",
      });
    },
    {
      onSettled: (_data, _error, _variables, _context) => logout(),
      ...options,
    }
  );
};
