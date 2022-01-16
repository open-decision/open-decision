import * as React from "react";
import { styled } from "../stitches";
import { center } from "./shared";

export const Stack = styled("div", center, {
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
});

export type StackProps = React.ComponentProps<typeof Stack>;
