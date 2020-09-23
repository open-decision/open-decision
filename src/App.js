//react-hot-loader needs to be imported before react and react-dom
import { hot } from "react-hot-loader/root";
import React from "react";
import { Switch, Route } from "react-router-dom";

import { Dashboard, Layout, Builder } from "./components/";

import { ProtectedRoute } from "./Features/Routing/ProtectedRoute";
import { Login } from "./Login";
import { ReactQueryDevtools } from "react-query-devtools";

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
