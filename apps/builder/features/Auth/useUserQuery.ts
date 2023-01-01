import { useQuery, useQueryClient } from "@tanstack/react-query";
import { proxiedClient } from "@open-decision/api-client";
import { APIError } from "@open-decision/type-classes";
import { TUpdateUserInput } from "@open-decision/api-specification";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useLogoutMutation } from "./mutations/useLogoutMutation";

export const userQueryKey = ["user"];

export const useUser = () => {
  const queryClient = useQueryClient();

  const useUserQuery = () =>
    useQuery(userQueryKey, () => proxiedClient.user.getUser(), {
      staleTime: Infinity,
      select(response) {
        return response.data;
      },
    });

  const useUserUpdateMutation = ({
    onSuccess,
    ...options
  }: UseMutationOptions<
    unknown,
    APIError<TUpdateUserInput>,
    Partial<TUpdateUserInput["body"]>
  >) => {
    return useMutation(
      ["updateUser"],
      (data: Partial<TUpdateUserInput["body"]>) => {
        return proxiedClient.user.updateUser({ body: data });
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

  const useDeleteUserMutation = (options?: UseMutationOptions) => {
    const { mutate: logout } = useLogoutMutation();

    return useMutation(
      ["deleteUser"],
      () => {
        return proxiedClient.user.deleteUser();
      },
      {
        onSettled: (_data, _error, _variables, _context) => logout(),
        ...options,
      }
    );
  };

  return {
    useUserQuery,
    useUserUpdateMutation,
    useDeleteUserMutation,
  };
};
