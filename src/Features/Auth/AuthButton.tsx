// @ts-nocheck
import React, { ComponentProps, FunctionComponent } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, SxProps } from "theme-ui";
import { useAuth } from "./useAuth";

export const AuthButton = ({ sx }: { sx: SxProps }) => {
  const auth = useAuth();
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  //TODO handle Auth Failure in UI
  return (
    <Button
      onClick={() => {
        return auth.user
          ? auth.signout(() => history.push("/"))
          : auth.signin({ callback: () => history.replace(from) });
      }}
      sx={sx}
    >
      {auth.user ? "Logout" : "Login"}
    </Button>
  );
};
