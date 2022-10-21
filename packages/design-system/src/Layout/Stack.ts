import * as React from "react";
import { styled } from "@open-decision/design-system/src/stitches";
import { center } from "@open-decision/design-system/src/shared/variants";

export const Stack = styled("div", center, {
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
});

export type StackProps = React.ComponentProps<typeof Stack>;
