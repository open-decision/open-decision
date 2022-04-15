import * as React from "react";
import { styled, css } from "../stitches";

export type LinkProps = React.ComponentProps<typeof Link>;

export const baseLinkStyles = css({
  display: "inline-flex",
  alignItems: "center",
  color: "$primary9",
  textDecoration: "none",
  position: "relative",
  textStyle: "medium-text",
  colorFallback: "$info11",

  focusType: "outer",
});

export const underlineLinkStyles = css({
  variants: {
    underline: {
      true: {
        "&::before": {
          content: '""',
          position: "absolute",
          display: "block",
          width: "100%",
          height: "2px",
          bottom: "-2px",
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
      },
    },
  },

  defaultVariants: {
    underline: false,
  },
});

export const Link = styled("a", baseLinkStyles, underlineLinkStyles);
