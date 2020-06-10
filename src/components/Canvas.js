import { WelcomeScreen, TreeTable } from "components";
import React from "react";

//DEP username is hardcoded

export const Canvas = ({ className }) => {
  return (
    <div
      className={className}
      sx={{
        backgroundColor: "#E5E5E5",
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "2fr 8fr 2fr",
        gridTemplateRows: "4fr 4fr",
      }}
    >
      <WelcomeScreen
        username="Dirk_laywer23"
        sx={{ gridColumn: "2 / 3", alignSelf: "flex-end", mb: 4 }}
      />
      <div
        sx={{
          backgroundColor: "grays.1",
          gridColumn: "1 / -1",
          display: "grid",
          gridTemplateColumns: "inherit",
        }}
      >
        <TreeTable sx={{ gridColumn: "2 / 3" }} />
      </div>
    </div>
  );
};
