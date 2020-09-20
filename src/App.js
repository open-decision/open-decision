//react-hot-loader needs to be imported before react and react-dom
import { hot } from "react-hot-loader/root";
import React from "react";
import { Switch, Route } from "react-router-dom";

import { Dashboard, Layout, Builder } from "./components/";
import { useAuth } from "./Hooks/Auth/useAuth";
import {
  fetchDatabase,
  ALL_TREES,
  getAllTreeData,
} from "./backend-integration/";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "./Login";

const App = () => {
  const [treeData, setTreeData] = React.useState([]);
  const auth = useAuth();

  React.useEffect(() => {
    if (auth.user) {
      const fetchData = async () => {
        setTreeData(
          await fetchDatabase({
            query: ALL_TREES,
            dataAccessor: getAllTreeData,
            token: auth.user,
          })
        );
      };
      fetchData();
    } else {
      setTreeData([]);
    }
  }, [auth.user]);

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
          <Dashboard treeData={treeData} />
        </ProtectedRoute>

        <ProtectedRoute path="/builder">
          <Builder />
        </ProtectedRoute>
      </Layout>
    </Switch>
  );
};

export default hot(App);
