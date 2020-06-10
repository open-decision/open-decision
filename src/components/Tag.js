import React from "react";
import { invert } from "polished";

const getRandomColor = () => Math.floor(Math.random() * 256);

export const Tag = ({ children }) => {
  const color = `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`;
  return (
    <div
      sx={{
        backgroundColor: color,
        borderRadius: 0,
        mr: 2,
        py: 2,
        px: 3,
        fontSize: "0.7em",
        color: invert(color),
      }}
    >
      {children}
    </div>
  );
};
