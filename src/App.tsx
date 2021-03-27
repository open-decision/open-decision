import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "components";
import { Builder, Dashboard, LoginCard } from "features";
import "./index.css";
import { useTokenRefresh } from "utils/useTokenRefresh";

//There are two versions of the App based around the auth state.
//If the user is authenticated he gets the AuthenticatedApp if not he gets the UnatuhenticatedApp, which is currently just the LoginCard.
export const App: React.FC = () => {
  const loginStatus = useTokenRefresh();

  return loginStatus === "loading" ? null : loginStatus === "loggedIn" ? (
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
          <Layout>
            <div className="flex justify-center items-center">
              <LoginCard />
            </div>
          </Layout>
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
