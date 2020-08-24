//react-hot-loader needs to be imported before react and react-dom
import { hot } from "react-hot-loader/root";
import React from "react";
import { ThemeProvider } from "theme-ui";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import theme from "./theme";
import { Dashboard, Layout, Builder } from "./components/";
import {
  fetchDatabase,
  ALL_TREES,
  getAllTreeData,
} from "./backend-integration/";

const App = () => {
  const [treeData, setTreeData] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      setTreeData(await fetchDatabase(ALL_TREES, getAllTreeData));
    };
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Layout>
          {/* <Route path="/" exact>
            <Dashboard treeData={treeData} />
          </Route> */}
          <Route path="/">
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
