import React from "react";
import { Box } from "theme-ui";

export const Logo = ({ as }) => (
  <Box
    as={as}
    to="/"
    sx={{ textDecoration: "none", color: "grays.2", fontSize: 5 }}
  >
    open <span sx={{ color: "secondary" }}>decision</span>
  </Box>
);
