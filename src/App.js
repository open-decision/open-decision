//react-hot-loader needs to be imported before react and react-dom
/** @jsx jsx */
import { hot } from "react-hot-loader/root";
// import React from "react";
import styled from "@emotion/styled";
import { jsx, ThemeProvider } from "theme-ui";
import theme from "./theme";

const StyledApp = styled.div`
  margin: 1rem;
  color: ${(props) => props.theme.colors.primary};
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StyledApp>
        <h1>Test</h1>
      </StyledApp>
    </ThemeProvider>
  );
}

export default hot(App);
