//react-hot-loader needs to be imported before react and react-dom
import { hot } from "react-hot-loader/root";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Dashboard, Layout, Builder } from "./components/";
import { useAuth } from "./Hooks/useAuth";
import {
  fetchDatabase,
  ALL_TREES,
  getAllTreeData,
} from "./backend-integration/";

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
          <Dashboard treeData={treeData} />
        </Route>
        <Route path="/builder/:treeId">
          <Builder />
        </Route>
      </Layout>
    </Switch>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default hot(AppWrapper);
