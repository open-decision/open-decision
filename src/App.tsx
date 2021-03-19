import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "components";
import { Builder, Dashboard, LoginCard } from "features";
import "./index.css";
import { useRefresh_TokenMutation } from "internalTypes";
import { useAuthStore } from "features/Data/AuthState";

//There are two versions of the App based around the auth state.
//If the user is authenticated he gets the AuthenticatedApp if not he gets the UnatuhenticatedApp, which is currently just the LoginCard.
export const App: React.FC = () => {
  //When refreshing the jwt cookie is discarded. We use the refresh cookie
  //to get a new cookie so all queries are authenticated when the user is logged in.
  const [token, login, logout, client] = useAuthStore((state) => [
    state.token,
    state.login,
    state.logout,
    state.client,
  ]);

  const auth = useRefresh_TokenMutation(client, {
    onError: () => logout(),
    onSuccess: ({ refreshToken }) =>
      refreshToken ? login({ ...refreshToken }) : logout(),
  });

  React.useEffect(() => auth.mutate({}), []);

  return auth.isLoading ? (
    <p>Loading ...</p>
  ) : token ? (
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
