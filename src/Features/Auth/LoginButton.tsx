/** @jsx jsx */
import React from "react";
import { Button, jsx } from "theme-ui";
import { useHistory, useLocation } from "react-router-dom";
import { FunctionComponent } from "react";
import { useAuthToken, useRefreshToken } from "./useTokens";
import { LocationState } from "types/global";
import { useLogin_UserMutation } from "../../generated/graphql";

export const LoginButton: FunctionComponent<{
  className?: string;
  email?: string;
  password?: string;
}> = ({
  className,
  email = "test@outlook.com",
  password = "fogmub-bifaj-sarjo8",
}) => {
  const [, setAuthToken] = useAuthToken();
  const [, setRefreshToken] = useRefreshToken();
  const [, login] = useLogin_UserMutation();

  const history = useHistory();
  const location = useLocation<LocationState>();

  const { from } = location.state || {
    from: { pathname: "/" },
  };

  const onCompleted = (data) => {
    setAuthToken(data.tokenAuth.token);
    setRefreshToken(data.tokenAuth.refreshToken);
    history.replace(from);
  };

  const onClickHandler = () =>
    login({ email, password }).then(({ data, error }) => {
      if (error) {
        console.error("registerUser failed", error);
      } else {
        data.tokenAuth.success === false
          ? console.error(data.tokenAuth.errors)
          : onCompleted(data);
      }
    });

  //TODO handle Failure in UI
  return (
    <Button onClick={onClickHandler} className={className}>
      Login
    </Button>
  );
};
