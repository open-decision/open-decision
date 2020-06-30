import React from "react";

export const Tag = ({ children, className }) => {
  return (
    <div
      sx={{
        borderRadius: 0,
        mr: 2,
        py: 2,
        px: 3,
        fontSize: "0.7em",
      }}
      className={className}
    >
      {children}
    </div>
  );
};
