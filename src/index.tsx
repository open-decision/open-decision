import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "theme-ui";
import { App } from "./App";
import theme from "./theme";
// import { ApolloProvider } from "@apollo/client";
import { client } from "./Features/Data/DataFetchingClient";
import { Provider } from "urql";

const AppContext = () => {
  return (
    <BrowserRouter>
      <Provider value={client}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  );
};

ReactDOM.render(<AppContext />, document.getElementById("root"));
