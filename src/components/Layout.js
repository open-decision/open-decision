import React from "react";
import styled from "@emotion/styled";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 7fr 2fr;
  grid-template-rows: min-content 15fr;
  height: 100vh;
  grid-template-areas:
    "header header"
    "canvas sidebar";
`;

export const Layout = ({ children }) => {
  return <Grid>{children}</Grid>;
};
