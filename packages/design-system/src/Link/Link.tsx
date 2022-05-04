import * as React from "react";
import { intentStyle } from "../shared/utils";
import { styled, css } from "../stitches";

export type LinkProps = React.ComponentProps<typeof Link>;

export const baseLinkStyles = css({
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  textStyle: "medium-text",
  colorFallback: "$primary11",
  borderRadius: "$sm",
  focusType: "outer",
  gap: "$1",

  ...intentStyle({ textDecoration: "underline" }),
});

export const Link = styled("a", baseLinkStyles);
