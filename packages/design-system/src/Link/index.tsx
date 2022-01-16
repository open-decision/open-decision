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
  maxWidth: "max-content",

  focusStyle: "outer",
});

export const underlineLinkStyles = css({
  "&:hover": {
    color: "$gray12",
  },

  variants: {
    underline: {
      true: {
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
      },
    },
  },

  defaultVariants: {
    underline: true,
  },
});

export const Link = styled("a", baseLinkStyles, underlineLinkStyles);
