import * as React from "react";
import { styled, css } from "../stitches";
import { intentSelector } from "../stitches/stateSelectors";
import { textSizeVariant } from "../Text";

export type LinkProps = React.ComponentProps<typeof Link>;

export const linkStyles = css({
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  colorFallback: "$primary11",
  borderRadius: "$sm",
  focusType: "outer",

  [`${intentSelector}`]: { textDecoration: "underline" },
});

export const Link = styled("a", textSizeVariant, linkStyles);
