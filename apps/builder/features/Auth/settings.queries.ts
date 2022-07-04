import { useMutation, UseMutationOptions } from "react-query";
import { useAuth } from "./useAuth";

type Data = { name?: string; email?: string; password?: string };

export const useUserUpdateMutation = (
  options?: UseMutationOptions<unknown, unknown, Data>
) => {
  const [{ context }] = useAuth();

  return useMutation(
    "updateUser",
    (data: Data) => {
      return fetch(`/users/${context?.user.uuid}`, {
        body: JSON.stringify(data),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context?.access.token}`,
        },
      });
    },
    options
  );
};

export const useDeleteUserMutation = (options?: UseMutationOptions) => {
  const [{ context }, send] = useAuth();

  return useMutation(
    "deleteUser",
    () => {
      return fetch(`/users/${context?.user.uuid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${context?.access.token}`,
        },
      });
    },
    {
      onSuccess: () => {
        send("LOG_OUT");
      },
      ...options,
    }
  );
};
