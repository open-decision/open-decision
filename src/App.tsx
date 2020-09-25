//react-hot-loader needs to be imported before react and react-dom
import React from "react";
import { hot } from "react-hot-loader/root";
import { Switch, Route } from "react-router-dom";
import { ReactQueryDevtools } from "react-query-devtools";
import { Dashboard, Layout } from "./components";
import { Login } from "./Login";
import { ProtectedRoute } from "./Features/Routing/ProtectedRoute";
import { Builder } from "./Features/Builder/Builder";

const App = () => {
  return (
    <Switch>
      <Layout>
        <Route path="/" exact>
          <h1>Unauthenticated Homepage</h1>
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
        <ReactQueryDevtools initialIsOpen={false} />
      </Layout>
    </Switch>
  );
};

export default hot(App);
