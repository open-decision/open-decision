import * as React from "react";
import { styled, css } from "../stitches";
import { intentSelector } from "../stitches/stateSelectors";

export type LinkProps = React.ComponentProps<typeof Link>;

export const baseLinkStyles = css({
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  textStyle: "medium-text",
  colorFallback: "$primary11",
  borderRadius: "$sm",
  focusType: "outer",

  [`${intentSelector}`]: { textDecoration: "underline" },
});

export const Link = styled("a", baseLinkStyles);
