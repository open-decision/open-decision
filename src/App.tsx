import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout, MainContent } from "components";
import { Builder, Dashboard, LoginCard } from "features";
import "./index.css";
import { authService } from "features/Data/authStateMachine";
import { useService } from "@xstate/react";

//There are two versions of the App based around the auth state.
//If the user is authenticated he gets the AuthenticatedApp if not he gets the UnatuhenticatedApp.
export const App: React.FC = () => {
  const [state] = useService(authService);

  return state.matches("loggedIn") ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  );
};

const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      {/* Login path. */}
      <Route
        path="/"
        element={
          <Layout>
            <MainContent
              css={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoginCard />
            </MainContent>
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
          <MainContent>
            <Dashboard />
          </MainContent>
        </Layout>
      }
    />

    {/* The builder and its nested routes */}
    <Route
      path="/builder/:id"
      element={
        <Layout>
          <MainContent
            css={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            <Builder />
          </MainContent>
        </Layout>
      }
    />
  </Routes>
);
