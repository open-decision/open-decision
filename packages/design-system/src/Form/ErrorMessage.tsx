import * as React from "react";
import { Box } from "@open-decision/design-system/src/Box";
import { styled } from "@open-decision/design-system/src/stitches";
import { textStyles } from "@open-decision/design-system/src/Text";

export const ErrorMessage = styled(Box, textStyles, {
  color: "$danger11",
  backgroundColor: "$danger2",
  borderRadius: "$md",
  maxWidth: "max-content",

  "&:empty": {
    display: "none",
  },

  "&:not(:empty)": {
    padding: "$1 $2",
  },
});

export type ErrorMessageProps = React.ComponentProps<typeof ErrorMessage>;
