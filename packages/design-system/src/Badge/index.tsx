import * as React from "react";
import { styled, css } from "../stitches";

export const badeStyles = css({
  colorScheme: "primary",
  borderRadius: "$full",
  border: "1px solid transparent",
  textAlign: "center",
  maxWidth: "max-content",

  variants: {
    variant: {
      primary: { backgroundColor: "$colorScheme9", color: "$colorScheme1" },
      secondary: { color: "$colorScheme11", borderColor: "currentcolor" },
    },
    size: {
      small: {
        paddingBlock: "$1",
        paddingInline: "$2",
        textStyle: "extra-small-text",
        letterSpacing: "0.0625em",
        fontWeight: 500,
        lineHeight: "1.25em",
      },
      medium: {
        paddingBlock: "$2",
        paddingInline: "$4",
        textStyle: "small-text",
        letterSpacing: "0.0625em",
        fontWeight: 500,
        lineHeight: "1.25em",
      },
      large: {
        paddingBlock: "$2",
        paddingInline: "$6",
        textStyle: "small-text",
        letterSpacing: "0.0625em",
        fontWeight: 500,
        lineHeight: "1.25em",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

export const Badge = styled("span", badeStyles);

export type BadgeProps = React.ComponentProps<typeof Badge>;
