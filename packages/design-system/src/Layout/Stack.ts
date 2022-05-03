import * as React from "react";
import { styled } from "../stitches";
import { center } from "../shared/variants";

export const Stack = styled("div", center, {
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
});

export type StackProps = React.ComponentProps<typeof Stack>;
