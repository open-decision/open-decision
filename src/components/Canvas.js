/** @jsx jsx */
// import React from "react";
import { jsx } from "theme-ui";

export const Canvas = ({ children, className }) => {
  return (
    <div sx={{ backgroundColor: "red" }} className={className}>
      {children}
    </div>
  );
};
