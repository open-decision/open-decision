import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "components";
import { Builder, Dashboard, LoginCard } from "features";
import "./index.css";
import { useRefresh_TokenMutation } from "internalTypes";
import { useAuthStore } from "features/Data/AuthState";
import { useTimeoutFn } from "react-use";

//There are two versions of the App based around the auth state.
//If the user is authenticated he gets the AuthenticatedApp if not he gets the UnatuhenticatedApp, which is currently just the LoginCard.
export const App: React.FC = () => {
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
  }, 30000);

  return loading ? null : status === "loggedIn" ? (
    <AuthenticatedApp />
  ) : (
    <UnathenticatedApp />
  );
};

const UnathenticatedApp: React.FC = () => {
  return (
    <Routes>
      {/* Login path. */}
      <Route
        path="/"
        element={
          <div className="flex justify-center items-center h-screen">
            <LoginCard />
          </div>
        }
      />
    </Routes>
  );
};

const AuthenticatedApp: React.FC = () => (
  <Routes>
    {/* The main path is the Users dashboard */}
    <Route
      path="/"
      element={
        <Layout>
          <Dashboard />
        </Layout>
      }
    />

    {/* The builder and its nested routes */}
    <Route
      path="/builder/:id"
      element={
        <Layout>
          <Builder />
        </Layout>
      }
    />
  </Routes>
);
