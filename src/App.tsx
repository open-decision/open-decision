import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "components";
import { Builder, Dashboard, LoginCard, useAuth } from "features";
import "./index.css";

//There are two versions of the App based around the auth state.
//If the user is authenticated he gets the AuthenticatedApp if not he gets the UnatuhenticatedApp, which is currently just the LoginCard.
export const App: React.FC = () => {
  const { token } = useAuth();

  return token ? <AuthenticatedApp /> : <UnathenticatedApp />;
};

const UnathenticatedApp: React.FC = () => (
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
      path="/builder"
      element={
        <Layout>
          <Builder />
        </Layout>
      }
    />
  </Routes>
);
