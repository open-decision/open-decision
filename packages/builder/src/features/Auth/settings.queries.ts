import { useMutation } from "react-query";
import { useAuth } from "./useAuth";

type Data = { name?: string; email?: string; password?: string };

export const useUserUpdateMutation = () => {
  const [{ context }] = useAuth();

  return useMutation((data: Data) => {
    return fetch(`/users/${context.auth?.user.uuid}`, {
      body: JSON.stringify(data),
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.auth?.access.token}`,
      },
    });
  });
};

export const useDeleteUserMutation = () => {
  const [{ context }, send] = useAuth();

  return useMutation(() => {
    return fetch(`/users/${context.auth?.user.uuid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${context.auth?.access.token}`,
      },
    }).then(() => send({ type: "LOG_OUT" }));
  });
};
