import { useQuery, useQueryClient } from "@tanstack/react-query";
import { proxiedOD } from "../Data/odClient";
import { APIError } from "@open-decision/type-classes";
import { TUpdateUserInput } from "@open-decision/api-specification";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useLogoutMutation } from "./mutations/useLogoutMutation";

export const userQueryKey = ["user"];

export const useUser = () => {
  const queryClient = useQueryClient();

  const useUserQuery = () =>
    useQuery(userQueryKey, () => proxiedOD.user.getUser(), {
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
        return proxiedOD.user.updateUser({ body: data });
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
        return proxiedOD.user.deleteUser();
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
