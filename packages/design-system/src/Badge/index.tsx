import * as React from "react";
import { styled, css } from "../stitches";

export const badeStyles = css({
  colorScheme: "primary",
  borderRadius: "$md",
  textAlign: "center",
  maxWidth: "max-content",
  backgroundColor: "$colorScheme2",
  border: "1px solid $colorScheme6",
  color: "$colorScheme11",
  display: "flex",
  alignItems: "center",
  gap: "$1",

  variants: {
    size: {
      small: {
        paddingInline: "$2",
        textStyle: "extra-small-text",
        fontWeight: "500",
      },
      medium: {
        paddingBlock: "$1",
        paddingInline: "$3",
        textStyle: "small-text",
        fontWeight: "500",
      },
      large: {
        paddingBlock: "$1",
        paddingInline: "$4",
        textStyle: "medium-text",
        fontWeight: "500",
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export const Badge = styled("span", badeStyles);

export type BadgeProps = React.ComponentProps<typeof Badge>;
