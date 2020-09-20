import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "./Hooks/useAuth";

export const ProtectedRoute = ({ children, ...props }) => {
  const auth = useAuth();

  return (
    <Route
      {...props}
      render={({ location }) => {
        return auth.user ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        );
      }}
    />
  );
};
