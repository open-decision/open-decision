import { Box } from "../Box";
import { styled } from "../stitches";
import { textSizeVariant, textStyles } from "../Text";

export const ErrorMessage = styled(Box, textSizeVariant, textStyles, {
  color: "$danger11",
  backgroundColor: "$danger1",
  borderRadius: "$md",

  "&:empty": {
    display: "none",
  },

  "&:not(:empty)": {
    padding: "$1 $2",
    border: "1px solid $colors$danger5",
  },
});
