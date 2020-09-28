/**@jsx jsx */
import { jsx } from "theme-ui";
import { Header } from "..";
import { Grid } from "theme-ui";

export const Layout = (props: any) => {
  return (
    <Grid sx={{ gridTemplateRows: "auto 1fr auto", minHeight: "100vh" }} gap={0}>
      <Header />
      {props.children}
      <footer>Footer content</footer>
    </Grid>
  );
};
