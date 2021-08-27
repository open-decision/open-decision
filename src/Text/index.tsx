import { styled } from "../stitches";

export const Text = styled("p", {
  fontFamily: "$text",
  lineHeight: "$normal",
  color: "var(--color, $gray12)",
  margin: "unset",

  variants: {
    size: {
      xl: {
        fontSize: "$xl",

        "@smallTablet": {
          fontSize: "$2xl",
        },
      },
      lg: {
        fontSize: "$lg",

        "@smallTablet": {
          fontSize: "$xl",
        },
      },
      md: { fontSize: "$base" },
      sm: {
        fontSize: "$sm",

        "@smallTablet": {
          fontSize: "$base",
        },
      },
      xs: {
        fontSize: "$xs",

        "@smallTablet": {
          fontSize: "$sm",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
