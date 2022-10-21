import * as React from "react";
import { styled } from "@open-decision/design-system/src/stitches";
import { center } from "@open-decision/design-system/src/shared/variants";

/**
 * Apply the `cover` className to the child element that should be the cover.
 */
export const Cover = styled("div", center, {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",

  "& > :first-child:not(.cover)": {
    marginTop: 0,
  },

  "& > :last-child:not(.cover)": {
    marginBottom: 0,
  },

  "& > .cover": {
    marginBlock: "auto",
  },
});

export type CoverProps = React.ComponentProps<typeof Cover>;
