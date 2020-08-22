import React from "react";
import { Header } from "./";
import { Grid } from "theme-ui";

export const Layout = (props) => {
  return (
    <Grid
      sx={{ gridTemplateRows: "auto 1fr auto", minHeight: "100vh" }}
      gap={0}
    >
      <Header />
      {props.children}
      <footer>Footer content</footer>
    </Grid>
  );
};
