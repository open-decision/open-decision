import { useAuthToken } from "../Auth/useTokens";
import React, { FunctionComponent } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

export const ProtectedRoute: FunctionComponent<RouteProps> = ({
  children,
  ...props
}) => {
  const { token } = useAuthToken();

  return (
    <Route
      {...props}
      render={({ location }) =>
        token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
