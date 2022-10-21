import * as React from "react";
import { styled, css } from "@open-decision/design-system/src/stitches";
import { intentSelector } from "@open-decision/design-system/src/stitches/stateSelectors";
import { textStyles } from "@open-decision/design-system/src/Text";

export type LinkProps = React.ComponentProps<typeof Link>;

export const linkStyles = css({
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  color: "$primary11",
  borderRadius: "$sm",
  focusType: "outer",

  [`${intentSelector}`]: { textDecoration: "underline" },
});

export const Link = styled("a", linkStyles, textStyles);
