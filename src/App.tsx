/** @jsx jsx */
import { jsx } from "theme-ui";
import { Switch, Route } from "react-router-dom";
import { Layout } from "./components";
import { Dashboard, ProtectedRoute, Builder, Login } from "./Features";
import { FunctionComponent } from "react";

export const App: FunctionComponent = () => {
  return (
    <Switch>
      <Layout>
        <Route path="/" exact>
          <div
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>Unauthenticated Homepage</h1>
          </div>
        </Route>
        <Route path="/login">
          <Login />
        </Route>

        <ProtectedRoute path="/dashboard">
          <Dashboard />
        </ProtectedRoute>
        <ProtectedRoute path="/builder">
          <Builder />
        </ProtectedRoute>
      </Layout>
    </Switch>
  );
};
