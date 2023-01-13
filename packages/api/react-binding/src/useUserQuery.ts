import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APIError } from "@open-decision/type-classes";
import { TUpdateUserInput } from "@open-decision/api-specification";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { TClient } from "@open-decision/api-client";
import { useAuthAPI } from "./useAuthAPI";

export type UseUpdateUserMutationOptions = UseMutationOptions<
  any,
  APIError,
  TUpdateUserInput["body"]
>;

export type UseDeleteUserMutationOptions = UseMutationOptions<
  any,
  APIError,
  void
>;

export const userQueryKey = ["user"];

export const useUser = (client: TClient) => {
  const queryClient = useQueryClient();

  const useUserQuery = () =>
    useQuery(userQueryKey, () => client.user.getUser(), {
      staleTime: Infinity,
      select(response) {
        return response.data;
      },
    });

  const useUpdateUserMutation = ({
    onSuccess,
    ...options
  }: UseUpdateUserMutationOptions) => {
    return useMutation(
      ["updateUser"],
      (data) => {
        return client.user.updateUser({ body: data });
      },
      {
        onSuccess: (...params) => {
          queryClient.invalidateQueries(userQueryKey);
          onSuccess?.(...params);
        },
        ...options,
      }
    );
  };

  const useDeleteUserMutation = (options?: UseDeleteUserMutationOptions) => {
    const router = useRouter();
    const { mutate: logout } = useAuthAPI().useLogoutMutation({
      onSuccess: () => router.push("/auth/login"),
    });

    return useMutation(
      ["deleteUser"],
      () => {
        return client.user.deleteUser();
      },
      {
        onSettled: (_data, _error, _variables, _context) => logout(),
        ...options,
      }
    );
  };

  return {
    useUserQuery,
    useUserUpdateMutation: useUpdateUserMutation,
    useDeleteUserMutation,
  };
};
