import React from "react";
import { useHistory } from "react-router-dom";
import { FunctionComponent } from "react";
import { useAuthToken, useRefreshToken } from "./useTokens";
import { useLogout_UserMutation } from "@internalTypes/generated/graphql";
import { Button } from "@components/index";

export const LogoutButton: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const [, , removeAuthToken] = useAuthToken();
  const [getRefreshToken, , removeRefreshToken] = useRefreshToken();
  const [, logout] = useLogout_UserMutation();

  const refreshToken = getRefreshToken();

  const history = useHistory();

  const onCompleted = () => {
    removeAuthToken();
    removeRefreshToken();
    history.push("/");
  };

  const onClickHandler = () =>
    logout({ refreshToken }).then(({ data, error }) => {
      if (error) {
        console.error("registerUser failed", error);
      } else {
        data.revokeToken.success === false
          ? console.error(data.revokeToken.errors)
          : onCompleted();
      }
    });

  //TODO handle Failure in UI
  return (
    <Button onClick={onClickHandler} className={className}>
      Logout
    </Button>
  );
};
