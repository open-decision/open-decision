//react-hot-loader needs to be imported before react and react-dom
/** @jsx jsx */
import { hot } from "react-hot-loader/root";
import React from "react";
import { jsx, ThemeProvider } from "theme-ui";
import theme from "./theme";
import { Header, Sidebar, Layout, Canvas } from "./components";

function App() {
  const [toggle, setToggle] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Header
          sx={{
            gridArea: "header",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <h1>Logo</h1>
          <button onClick={() => setToggle(!toggle)}>Einklappen</button>
        </Header>
        <Sidebar sx={{ gridArea: "sidebar" }} toggle={toggle}>
          Test
        </Sidebar>
        <Canvas sx={toggle ? { gridArea: "canvas" } : { gridColumn: "1 / -1" }}>
          Canvas
        </Canvas>
      </Layout>
    </ThemeProvider>
  );
}

export default hot(App);
