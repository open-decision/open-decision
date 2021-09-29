import { styled } from "../stitches";

export type TextProps = React.ComponentProps<typeof Text>;
export const Text = styled("p", {
  fontFamily: "$text",
  lineHeight: "$normal",
  color: "var(--color, $gray12)",
  margin: "unset",
  letterSpacing: 0,

  variants: {
    size: {
      lg: { fontSize: "$lg", lineHeight: "1.3em" },
      md: { fontSize: "$base" },
      sm: { fontSize: "$xs", lineHeight: "1.125em" },
    },
    type: {
      overline: {
        fontSize: "$sm",
        letterSpacing: "0.01em",
        fontWeight: "$medium",
      },
      caption: {
        fontSize: "$xs",
        lineHeight: 1.3,
        letterSpacing: "0.005em",
        fontWeight: "$regular",
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
