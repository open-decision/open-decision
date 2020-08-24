import React from "react";
import { Link } from "theme-ui";

export const Logo = ({ as = null }) => (
  <Link
    as={as}
    href="/"
    sx={{ textDecoration: "none", color: "grays.2", fontSize: 5 }}
  >
    open <span sx={{ color: "secondary" }}>decision</span>
  </Link>
);
