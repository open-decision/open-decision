//react-hot-loader needs to be imported before react and react-dom
import { hot } from "react-hot-loader/root";
import React from "react";
import { Button, ThemeProvider } from "theme-ui";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import theme from "./theme";
import { Dashboard, Layout, Builder } from "./components/";
import {
  fetchDatabase,
  ALL_TREES,
  getAllTreeData,
  getToken,
  GET_TOKEN,
} from "./backend-integration/";

const App = () => {
  const [treeData, setTreeData] = React.useState();
  const [token, setToken] = React.useState();

  React.useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setTreeData(await fetchDatabase(ALL_TREES, getAllTreeData, token));
      };
      fetchData();
    }
  }, [token]);

  const fetchTokenHandler = async () =>
    setToken(await fetchDatabase(GET_TOKEN, getToken));

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Layout>
          <Route path="/" exact>
            <Dashboard treeData={treeData} />
            <Button onClick={fetchTokenHandler}>Login</Button>
          </Route>
          <Route path="/builder/:treeId">
            <Builder />
          </Route>
        </Layout>
      </Switch>
    </ThemeProvider>
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
