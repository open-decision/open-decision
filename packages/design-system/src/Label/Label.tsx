import { styled } from "../stitches";

export type LabelProps = React.ComponentProps<typeof Label>;
export const Label = styled("label", {
  color: "var(--color, $colorScheme-text)",

  variants: {
    size: {
      small: {
        textStyle: "small-text",
        fontWeight: 600,
      },
      medium: {
        textStyle: "medium-text",
        fontWeight: 600,
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});
