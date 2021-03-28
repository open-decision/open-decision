import React from "react";
import { loginStatus, useAuthStore } from "features/Data/AuthState";
import { useTimeoutFn } from "react-use";
import { useRefresh_TokenMutation } from "internalTypes";

export const useTokenRefresh = (): loginStatus => {
  //When refreshing the jwt cookie is discarded. We use the refresh cookie
  //to get a new cookie so all queries are authenticated when the user is logged in.
  const [status, login, logout, client] = useAuthStore((state) => [
    state.status,
    state.login,
    state.logout,
    state.client,
  ]);

  const auth = useRefresh_TokenMutation(client, {
    onError: () => logout(),
    onSuccess: () => login(),
  });

  //We get the mutate function specifically so we only depend on it in the Effect.
  const { mutate: authenticate } = auth;

  React.useEffect(() => authenticate({}), [authenticate]);

  const [_isReady, _cancel, reset] = useTimeoutFn(() => {
    authenticate({});
    reset();
  }, 300000);

  return status;
};
