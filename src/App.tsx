/** @jsx jsx */
import { jsx } from "theme-ui";
import { Switch, Route } from "react-router-dom";
import { Layout } from "@components/index";
import { Dashboard, ProtectedRoute, LoginForm, Builder } from "@features/index";
import { FunctionComponent } from "react";
import "./index.css";

export const App: FunctionComponent = () => {
  return (
    <Switch>
      <Layout>
        <Route path="/" exact>
          <div className="flex justify-center items-center">
            <h1 className="text-4xl">Unauthenticated Homepage</h1>
          </div>
        </Route>
        <Route path="/login">
          <div className="flex justify-center items-center">
            <LoginForm />
          </div>
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
