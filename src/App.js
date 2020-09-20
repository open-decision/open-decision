//react-hot-loader needs to be imported before react and react-dom
import { hot } from "react-hot-loader/root";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Dashboard, Layout, Builder } from "./components/";
import { useAuth } from "./Hooks/useAuth";
// import {
//   fetchDatabase,
//   ALL_TREES,
//   getAllTreeData,
// } from "./backend-integration/";

const App = () => {
  const [treeData, setTreeData] = React.useState();
  const auth = useAuth();

  // React.useEffect(() => {
  //   if (token) {
  //     const fetchData = async () => {
  //       setTreeData(await fetchDatabase(ALL_TREES, getAllTreeData, token));
  //     };
  //     fetchData();
  //   }
  // }, [token]);

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
