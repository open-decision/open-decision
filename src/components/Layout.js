import React from "react";
import { Header } from "components";
import { Grid } from "theme-ui";

export const Layout = (props) => {
  return (
    <Grid sx={{ gridTemplateRows: "auto 1fr auto", minHeight: "100vh" }}>
      <Header />
      {props.children}
      <footer>Footer content</footer>
    </Grid>
  );
};
