/** @jsx jsx */
import React from "react";
import { Button, jsx } from "theme-ui";
import { useHistory, useLocation } from "react-router-dom";
import { FunctionComponent } from "react";
// import { useMutation } from "@apollo/client";
import { LOGIN_USER, LOGOUT_USER } from "./authQueries";
import { useAuthToken, useRefreshToken } from "./useTokens";
import { LocationState } from "types/global";
import { useMutation } from "urql";

export const AuthButton: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const {
    getToken: getAuthToken,
    setToken: setAuthToken,
    removeToken: removeAuthToken,
  } = useAuthToken();

  const {
    getToken: getRefreshToken,
    setToken: setRefreshToken,
    removeToken: removeRefreshToken,
  } = useRefreshToken();

  const authToken = getAuthToken();
  const refreshToken = getRefreshToken();

  const history = useHistory();
  const location = useLocation<LocationState>();

  const { from } = location.state || {
    from: { pathname: "/" },
  };

  const login = {
    query: LOGIN_USER,
    onCompleted: (data) => {
      setAuthToken(data.tokenAuth.token);
      setRefreshToken(data.tokenAuth.refreshToken);
      history.replace(from);
    },
    text: "Login",
    variables: { email: "test@outlook.de", password: "fogmub-bifDaj-sarjo8" },
  };

  const logout = {
    query: LOGOUT_USER,
    onCompleted: () => {
      removeAuthToken();
      removeRefreshToken();
      history.push("/");
    },
    text: "Logout",
    variables: { refreshToken: refreshToken ? refreshToken : "" },
  };

  const loginState = authToken ? logout : login;

  const [, updateTodo] = useMutation(loginState.query);

  //TODO handle Auth Failure in UI
  return (
    <Button
      onClick={() =>
        updateTodo(loginState.variables).then(({ data }) =>
          loginState.onCompleted(data)
        )
      }
      className={className}
    >
      {loginState.text}
    </Button>
  );
};
