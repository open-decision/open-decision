import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "theme-ui";
import App from "./App.js";
import { AuthProvider } from "./Hooks/useAuth.js";
import theme from "./theme";

const AppContext = () => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

ReactDOM.render(<AppContext />, document.getElementById("root"));
