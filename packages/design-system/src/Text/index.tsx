import { styled, css } from "../stitches";

export type TextProps = React.ComponentProps<typeof Text>;

export const textStyles = css({
  colorFallback: "$black",
  margin: "unset",

  variants: {
    size: {
      large: { textStyle: "large-text" },
      medium: { textStyle: "medium-text" },
      small: { textStyle: "small-text" },
      "extra-small": { textStyle: "extra-small-text" },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export const Text = styled("p", textStyles);
