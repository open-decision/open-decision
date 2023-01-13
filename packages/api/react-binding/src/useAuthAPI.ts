import { APIClient, TClient } from "@open-decision/api-client";
import { FetchResponse } from "@open-decision/api-helpers";
import {
  TResetPasswordOutput,
  TResetPasswordInput,
  TForgotPasswordInput,
  TLoginInput,
  TLoginOutput,
  TRegisterInput,
  TRegisterOutput,
} from "@open-decision/api-specification";
import { APIError } from "@open-decision/type-classes";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

export type UseResetPasswordMutationOptions = UseMutationOptions<
  FetchResponse<Response, TResetPasswordOutput>,
  APIError,
  TResetPasswordInput["body"],
  unknown
>;

export type UseRegisterMutationOptions = UseMutationOptions<
  FetchResponse<Response, TRegisterOutput>,
  APIError,
  TRegisterInput["body"],
  unknown
>;

export type useLogoutMutationOptions = UseMutationOptions<
  FetchResponse<Response, void>,
  APIError,
  void,
  unknown
>;

export type UseForgotPasswordMutationOptions = UseMutationOptions<
  FetchResponse<Response, void>,
  APIError,
  TForgotPasswordInput["body"],
  unknown
>;

export type UseLoginMutationOptions = UseMutationOptions<
  FetchResponse<Response, TLoginOutput>,
  APIError,
  TLoginInput["body"],
  unknown
>;

export const useAuthAPI = (client: TClient = APIClient) => {
  function useResetPasswordMutation(config?: UseResetPasswordMutationOptions) {
    return useMutation(
      ["resetPassword"],
      ({ token, password }) => {
        return client.auth.resetPassword({
          body: { password, token },
        });
      },
      config
    );
  }

  function useRegisterMutation(config?: UseRegisterMutationOptions) {
    return useMutation(
      ["register"],
      ({ email, password, toc }) => {
        return client.auth.register({
          body: { email, password, toc },
        });
      },
      config
    );
  }

  function useLogoutMutation(config?: useLogoutMutationOptions) {
    return useMutation(
      ["logout"],
      () => {
        return client.auth.logout({
          body: { refreshToken: "" },
        });
      },
      config
    );
  }

  function useForgotPasswordMutation(
    config?: UseForgotPasswordMutationOptions
  ) {
    return useMutation(
      ["forgotPassword"],
      ({ email }) => {
        return client.auth.forgotPassword({
          body: { email },
        });
      },
      config
    );
  }

  function useLoginMutation(config?: UseLoginMutationOptions) {
    return useMutation(
      ["login"],
      ({ email, password }) => {
        return client.auth.login({
          body: { email, password },
        });
      },
      config
    );
  }

  return {
    useResetPasswordMutation,
    useLoginMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useRegisterMutation,
  };
};
