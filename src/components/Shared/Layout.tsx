/**@jsx jsx */
import { jsx } from "theme-ui";
import { Header } from "..";
import { Grid } from "theme-ui";
import { FunctionComponent } from "react";

export const Layout: FunctionComponent = ({ children }) => {
  return (
    <Grid sx={{ gridTemplateRows: "auto 1fr auto", minHeight: "100vh" }} gap={0}>
      <Header />
      {children}
      <footer>Footer content</footer>
    </Grid>
  );
};
