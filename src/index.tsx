import React from "react";
import ReactDOM from "react-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "theme-ui";
import App from "./App";
import { AuthProvider } from "./Features/Auth/useAuth";
import theme from "./theme";

const AppContext = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

ReactDOM.render(<AppContext />, document.getElementById("root"));
