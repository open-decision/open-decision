/** @jsx jsx */
import { Container, jsx } from "theme-ui";
import { Switch, Route } from "react-router-dom";
import { Layout } from "./components";
import { Dashboard, ProtectedRoute, Login, Builder } from "./Features";
import { FunctionComponent } from "react";

export const App: FunctionComponent = () => {
  return (
    <Switch>
      <Layout>
        <Route path="/" exact>
          <Container>
            <h1>Unauthenticated Homepage</h1>
          </Container>
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
