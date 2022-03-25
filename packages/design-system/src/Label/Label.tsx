import { styled, css } from "../stitches";

export const labelStyles = css({
  display: "flex",
  colorFallback: "$colorScheme-text",
  alignItems: "center",
  gap: "$3",

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

export type LabelProps = React.ComponentProps<typeof Label>;
export const Label = styled("label", labelStyles);
