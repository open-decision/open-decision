import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "theme-ui";
import App from "./App.js";
import { AuthProvider } from "./Hooks/useAuth.js";
import theme from "./theme";

const AppContext = () => (
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </AuthProvider>
);

ReactDOM.render(<AppContext />, document.getElementById("root"));
