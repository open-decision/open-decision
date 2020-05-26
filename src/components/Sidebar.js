/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";

export const Sidebar = ({ children, className, toggle }) => {
  return (
    <>
      {toggle ? (
        <div sx={{ backgroundColor: "blue" }} className={className}>
          {children}
        </div>
      ) : null}
    </>
  );
};
