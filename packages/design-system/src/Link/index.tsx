import * as React from "react";
import { textStyles } from "..";
import { styled, css } from "../stitches";

export type LinkProps = React.ComponentProps<typeof Link>;

export const baseLinkStyles = css(textStyles, {
  display: "flex",
  alignItems: "center",
  color: "$primary9",
  textDecoration: "none",
  position: "relative",

  focusStyle: "outer",
});

export const Link = styled("a", baseLinkStyles, {
  "&:hover": {
    color: "$gray12",
  },

  "&::before": {
    content: '""',
    position: "absolute",
    display: "block",
    width: "100%",
    height: "2px",
    bottom: "0",
    left: "0",
    backgroundColor: "currentcolor",
    transform: "scaleX(0)",
    transformOrigin: "top left",
    transition: "transform 0.3s ease",
  },

  "&:hover::before": {
    transform: "scaleX(1)",
  },

  "&:active::before": {
    transform: "scaleX(1)",
  },
});
