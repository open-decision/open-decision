import * as React from "react";
import { styled } from "@open-decision/design-system/src/stitches";
import { center } from "@open-decision/design-system/src/shared/variants";

export const Row = styled("div", center, {
  display: "flex",
  justifyContent: "flex-start",
});

export type RowProps = React.ComponentProps<typeof Row>;
