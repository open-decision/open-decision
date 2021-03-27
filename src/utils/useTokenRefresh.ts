import React from "react";
import { useAuthStore } from "features/Data/AuthState";
import { useTimeoutFn } from "react-use";
import { useRefresh_TokenMutation } from "internalTypes";

type loginStatus = "loggedIn" | "loggedOut" | "loading";

export const useTokenRefresh = (): loginStatus => {
  const [loading, setLoading] = React.useState(true);

  //When refreshing the jwt cookie is discarded. We use the refresh cookie
  //to get a new cookie so all queries are authenticated when the user is logged in.
  const [status, login, logout, client] = useAuthStore((state) => [
    state.status,
    state.login,
    state.logout,
    state.client,
  ]);

  const auth = useRefresh_TokenMutation(client, {
    onError: () => {
      setLoading(false);
      logout();
    },
    onSuccess: ({ refreshToken }) => {
      setLoading(false);
      refreshToken ? login({ ...refreshToken }) : logout();
    },
  });

  //We get the mutate function specifically so we only depend on it in the Effect.
  const { mutate: getToken } = auth;

  React.useEffect(() => getToken({}), [getToken]);

  const [_isReady, _cancel, reset] = useTimeoutFn(() => {
    getToken({});
    reset();
  }, 300000);

  const loginStatus = loading ? "loading" : status;
  return loginStatus;
};
