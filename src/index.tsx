import React from "react";
import ReactDOM from "react-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "theme-ui";
import { App } from "./App";
import theme from "./theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "./ApolloClient";

const AppContext = () => {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

ReactDOM.render(<AppContext />, document.getElementById("root"));
