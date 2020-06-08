//react-hot-loader needs to be imported before react and react-dom
import { hot } from "react-hot-loader/root";
import React from "react";
import { ThemeProvider } from "theme-ui";
import theme from "./theme";
import { Header, Layout, Canvas } from "./components";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Header
          sx={{
            gridArea: "header",
            backgroundColor: "green",
            color: "white",
          }}
        >
          <h1>Logo</h1>
        </Header>
        <Canvas />
      </Layout>
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
