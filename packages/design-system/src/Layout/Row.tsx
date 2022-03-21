import * as React from "react";
import { styled } from "../stitches";
import { center } from "../shared/variants";

export const Row = styled("div", center, {
  display: "flex",
  justifyContent: "flex-start",
});

export type RowProps = React.ComponentProps<typeof Row>;
