//react-hot-loader needs to be imported before react and react-dom
import { hot } from "react-hot-loader/root";
import React from "react";
import styled from "@emotion/styled";

const StyledApp = styled.div`
  margin: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  color: red;
`;

function App() {
  return (
    <StyledApp>
      <h1>Test</h1>
    </StyledApp>
  );
}

export default hot(App);
